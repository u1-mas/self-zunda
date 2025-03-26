import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
	type AudioPlayer,
	type AudioPlayerState,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	StreamType,
	type VoiceConnection,
	VoiceConnectionStatus,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { logger } from "./logger.ts";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

// デバッグ用の音声ファイル保存ディレクトリ
const DEBUG_AUDIO_DIR = join(process.cwd(), "debug-audio");

// デバッグディレクトリの初期化
function initDebugDir(): void {
	if (!existsSync(DEBUG_AUDIO_DIR)) {
		try {
			mkdirSync(DEBUG_AUDIO_DIR, { recursive: true });
			logger.info(`デバッグ用音声ディレクトリを作成したのだ: ${DEBUG_AUDIO_DIR}`);
		} catch (err) {
			logger.error(
				`デバッグディレクトリの作成に失敗したのだ: ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	}
}

// 初期化
initDebugDir();

/**
 * Bufferを使ってファイルにデータを保存し、そのファイルからAudioResourceを作成する
 * @param audioBuffer 音声バッファ
 * @param fileName 保存するファイル名（指定しない場合はランダム生成）
 * @returns 作成されたリソースとファイルパス
 */
async function createResourceFromBuffer(
	audioBuffer: Buffer,
	fileName?: string,
): Promise<{ resource: ReturnType<typeof createAudioResource>; filePath: string }> {
	// ファイル名が指定されていない場合はランダム生成
	const debugFileName = fileName || `voice-${randomUUID()}.bin`;
	const debugFilePath = join(DEBUG_AUDIO_DIR, debugFileName);

	// バッファをファイルに保存
	logger.debug(
		`音声バッファをデバッグ用ファイル ${debugFilePath} に保存するのだ (サイズ: ${audioBuffer.length} バイト)`,
	);
	await writeFile(debugFilePath, audioBuffer);
	logger.debug(`デバッグ用音声ファイルを保存したのだ: ${debugFilePath}`);

	// ファイルからストリームを作成
	logger.debug(`ファイルからストリームを作成するのだ: ${debugFilePath}`);
	const stream = createReadStream(debugFilePath);

	// 音声リソースを作成
	logger.debug("音声リソースを作成するのだ (ファイルから)");
	const resource = createAudioResource(stream, {
		inputType: StreamType.Arbitrary,
		inlineVolume: true,
	});

	// ボリューム設定
	if (resource.volume) {
		resource.volume.setVolume(1.0);
	}

	return { resource, filePath: debugFilePath };
}

/**
 * オーディオリソースを作成して再生する関数
 */
async function createAndPlayAudio(player: AudioPlayer, audioBuffer: Buffer): Promise<string> {
	try {
		// バッファからリソースを作成
		const { resource, filePath } = await createResourceFromBuffer(audioBuffer);

		// リソースを再生
		logger.debug("音声の再生を開始するのだ");
		player.play(resource);

		return filePath;
	} catch (err) {
		logger.error(
			`音声リソースの作成中にエラーが発生したのだ: ${err instanceof Error ? err.message : String(err)}`,
		);
		throw err;
	}
}

/**
 * ボイスコネクションの状態を確認し、必要に応じて修復する
 * @param connection ボイスコネクション
 * @returns 接続が正常かどうか
 */
function ensureConnectionReady(
	connection: VoiceConnection,
	reject: (reason?: Error) => void,
): boolean {
	logger.debug(`ボイスコネクションの現在の状態: ${connection.state.status}`);
	if (connection.state.status === VoiceConnectionStatus.Ready) {
		return true;
	}

	logger.warn(`ボイスコネクションの状態が Ready ではないのだ: ${connection.state.status}`);

	// 接続中の場合は待機する
	if (connection.state.status === VoiceConnectionStatus.Connecting) {
		logger.debug("ボイスコネクションが接続中なので、Ready状態になるのを待つのだ");
		return false;
	}

	// 切断または破壊された場合は再接続を試みる
	if (
		connection.state.status === VoiceConnectionStatus.Disconnected ||
		connection.state.status === VoiceConnectionStatus.Destroyed
	) {
		logger.warn("ボイスコネクションが切断されているのだ、再接続を試みるのだ");
		try {
			connection.rejoin();
			logger.debug("ボイスコネクションの再接続を試みたのだ");
			return false;
		} catch (err) {
			logger.error("ボイスコネクションの再接続に失敗したのだ:", err);
			reject(new Error("ボイスコネクションの再接続に失敗したのだ"));
			return false;
		}
	}

	return false;
}

/**
 * 音声プレイヤーを準備または取得する
 * @param guildId ギルドID
 * @param connection ボイスコネクション
 * @returns 準備されたオーディオプレイヤー
 */
function preparePlayer(guildId: string, connection: VoiceConnection): AudioPlayer {
	let player = players.get(guildId);

	if (player) {
		logger.debug(
			`ギルドID: ${guildId} の既存プレイヤーを使用するのだ (状態: ${player.state.status})`,
		);

		// プレイヤーが別の音声を再生中の場合は一度停止する
		if (player.state.status !== AudioPlayerStatus.Idle) {
			logger.debug(
				`プレイヤーが他の音声を再生中なので一旦停止するのだ (現在の状態: ${player.state.status})`,
			);
			player.stop();
		}
	} else {
		logger.debug(`ギルドID: ${guildId} の新しいプレイヤーを作成するのだ`);
		// NoSubscriberBehaviorを指定して安定性を向上
		player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});
		players.set(guildId, player);
		logger.debug(
			`ボイスコネクションをプレイヤーに購読させるのだ (接続状態: ${connection.state.status})`,
		);
		connection.subscribe(player);
	}

	return player;
}

/**
 * プレイヤーにイベントリスナーを設定する
 * @param player オーディオプレイヤー
 * @param resolve Promise.resolveコールバック
 * @param reject Promise.rejectコールバック
 * @returns クリーンアップ用のイベントリスナー
 */
function setupPlayerListeners(
	player: AudioPlayer,
	resolve: () => void,
	reject: (reason?: Error) => void,
): {
	debugListener: (oldState: AudioPlayerState, newState: AudioPlayerState) => void;
	errorListener: (err: Error) => void;
} {
	// すべての状態変化をデバッグする
	const debugListener = (oldState: AudioPlayerState, newState: AudioPlayerState) => {
		logger.debug(`プレイヤー状態変化 [拡張]: ${oldState.status} → ${newState.status}`);
		if (newState.status === AudioPlayerStatus.Playing) {
			logger.debug("音声の再生が開始されたのだ！");
		} else if (newState.status === AudioPlayerStatus.Buffering) {
			logger.debug("音声データをバッファリング中なのだ...");
		}
	};
	player.on("stateChange", debugListener);

	// エラー監視を強化
	const errorListener = (err: Error) => {
		logger.error(`プレイヤーでエラーが発生したのだ: ${err.message}`);
	};
	player.on("error", errorListener);

	// 再生完了またはエラー時の処理
	const completionListener = (oldState: AudioPlayerState, newState: AudioPlayerState) => {
		logger.debug(`プレイヤーの状態が変化したのだ: ${oldState.status} → ${newState.status}`);

		// Buffering状態に移行したら、再生またはアイドル状態への移行を監視
		if (newState.status === AudioPlayerStatus.Buffering) {
			logger.debug("音声がバッファリング中なのだ、再生開始を待つのだ...");

			// Buffering -> Playing への遷移を監視
			const checkPlaying = (oldS: AudioPlayerState, newS: AudioPlayerState) => {
				logger.debug(`ステート確認: ${oldS.status} → ${newS.status}`);
				if (newS.status === AudioPlayerStatus.Playing) {
					logger.debug("バッファリングから再生状態へ移行したのだ！");
					player.off("stateChange", checkPlaying);
				} else if (newS.status === AudioPlayerStatus.Idle) {
					logger.debug("バッファリングからアイドル状態に戻ったのだ（再生されなかった）");
					// 何らかの理由で再生されなかった場合でも、デバッグのためにファイルは残す
					player.off("stateChange", checkPlaying);
					resolve(); // 完了として扱う
				}
			};

			player.on("stateChange", checkPlaying);
		}

		if (
			newState.status === AudioPlayerStatus.Idle &&
			oldState.status === AudioPlayerStatus.Playing
		) {
			// 再生完了
			logger.debug("音声再生が完了したのだ");

			// クリーンアップ
			player.off("stateChange", debugListener);
			player.off("error", errorListener);

			resolve();
		}
	};
	player.once("stateChange", completionListener);

	// エラー時の処理
	player.once("error", (err) => {
		logger.error(`音声の再生中にエラーが発生したのだ: ${err.message}`);
		logger.debug(`音声再生エラー: ${err.message || "不明なエラー"}`);

		// クリーンアップ
		player.off("stateChange", debugListener);
		player.off("error", errorListener);

		reject(err);
	});

	return { debugListener, errorListener };
}

/**
 * 音声を再生する
 * @param connection ボイスコネクション
 * @param audioBuffer 音声バッファ（Node.jsのBuffer型）
 */
export async function playAudio(connection: VoiceConnection, audioBuffer: Buffer): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const guildId = connection.joinConfig.guildId;
			logger.debug(
				`ギルドID: ${guildId} の音声を再生するのだ (バッファサイズ: ${audioBuffer.length} バイト)`,
			);

			// ボイスコネクションの状態をチェック
			if (!ensureConnectionReady(connection, reject)) {
				// 接続が準備中の場合は、準備完了後に再試行
				if (connection.state.status === VoiceConnectionStatus.Connecting) {
					connection.once(VoiceConnectionStatus.Ready, () => {
						logger.debug("ボイスコネクションが Ready になったのだ！再試行するのだ");
						playAudio(connection, audioBuffer).then(resolve).catch(reject);
					});
				}
				return;
			}

			// プレイヤーを準備
			const player = preparePlayer(guildId, connection);

			// イベントリスナーを設定
			setupPlayerListeners(player, resolve, reject);

			// 音声を再生
			createAndPlayAudio(player, audioBuffer)
				.then((filePath) => {
					logger.debug(`再生用ファイルを作成したのだ: ${filePath}`);
				})
				.catch((err) => {
					logger.error(
						`音声再生の準備中にエラーが発生したのだ: ${err instanceof Error ? err.message : String(err)}`,
					);
					reject(err);
				});
		} catch (err) {
			logger.error(
				`音声再生の準備中にエラーが発生したのだ: ${err instanceof Error ? err.message : String(err)}`,
			);
			reject(err instanceof Error ? err : new Error(String(err)));
		}
	});
}

/**
 * 音声再生を停止する
 */
export function stopAudio(guildId: string): void {
	const player = players.get(guildId);
	if (player) {
		logger.debug(`ギルドID: ${guildId} の音声再生を停止するのだ`);
		player.stop();
	}
}

/**
 * プレイヤーを取得する
 */
export function getPlayer(guildId: string): AudioPlayer | undefined {
	return players.get(guildId);
}
