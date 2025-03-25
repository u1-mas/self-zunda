import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	type AudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	StreamType,
	type VoiceConnection,
	VoiceConnectionStatus,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { debug, error, info, warn } from "./logger";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

// デバッグ用の音声ファイル保存ディレクトリ
const DEBUG_AUDIO_DIR = join(process.cwd(), "debug-audio");

// デバッグディレクトリの初期化
function initDebugDir(): void {
	if (!existsSync(DEBUG_AUDIO_DIR)) {
		try {
			mkdirSync(DEBUG_AUDIO_DIR, { recursive: true });
			info(`デバッグ用音声ディレクトリを作成したのだ: ${DEBUG_AUDIO_DIR}`);
		} catch (err) {
			error(
				`デバッグディレクトリの作成に失敗したのだ: ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	}
}

// 初期化
initDebugDir();

/**
 * バッファから直接AudioResourceを作成する
 * @param audioBuffer 音声バッファ
 * @returns 作成されたAudioResource
 */
function createResourceFromBuffer(audioBuffer: Buffer) {
	debug(`メモリ内でAudioResourceを作成するのだ (サイズ: ${audioBuffer.length} バイト)`);

	// バッファから直接リソースを作成
	const resource = createAudioResource(audioBuffer, {
		inputType: StreamType.Arbitrary,
		inlineVolume: true,
	});

	// ボリューム設定
	if (resource.volume) {
		resource.volume.setVolume(1.0);
	}

	return resource;
}

async function createAndPlayAudio(
	player: AudioPlayer,
	audioBuffer: Buffer,
	shouldSaveFile = true,
): Promise<void> {
	let debugFilePath: string | null = null;

	if (shouldSaveFile) {
		// デバッグ用にファイルを保存
		const fileName = `voice-${randomUUID()}.bin`;
		debugFilePath = join(DEBUG_AUDIO_DIR, fileName);

		debug(
			`音声バッファをデバッグ用ファイル ${debugFilePath} に保存するのだ (サイズ: ${audioBuffer.length} バイト)`,
		);
		await writeFile(debugFilePath, audioBuffer);
		info(`デバッグ用音声ファイルを保存したのだ: ${debugFilePath}`);

		// ファイルからリソースを作成（従来の方法）
		debug(`ファイルからストリームを作成するのだ: ${debugFilePath}`);
		const stream = createReadStream(debugFilePath);

		debug("音声リソースを作成するのだ (ファイルから)");
		const resource = createAudioResource(stream, {
			inputType: StreamType.Arbitrary,
			inlineVolume: true,
		});

		// ボリューム設定
		if (resource.volume) {
			resource.volume.setVolume(1.0);
		}

		debug("音声の再生を開始するのだ (ファイルから)");
		player.play(resource);
	} else {
		// バッファから直接リソースを作成して再生（新しい方法）
		try {
			debug("バッファから直接AudioResourceを作成して再生するのだ");
			const resource = createResourceFromBuffer(audioBuffer);
			player.play(resource);
		} catch (err) {
			error(
				`バッファからのリソース作成に失敗したのだ: ${err instanceof Error ? err.message : String(err)}`,
			);
			throw err;
		}
	}

	return debugFilePath ? Promise.resolve() : Promise.resolve();
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
			debug(
				`ギルドID: ${guildId} の音声を再生するのだ (バッファサイズ: ${audioBuffer.length} バイト)`,
			);

			// ボイスコネクションの状態をチェック
			debug(`ボイスコネクションの現在の状態: ${connection.state.status}`);
			if (connection.state.status !== VoiceConnectionStatus.Ready) {
				warn(`ボイスコネクションの状態が Ready ではないのだ: ${connection.state.status}`);

				// 接続が Ready でない場合は Ready になるまで待つ
				if (connection.state.status === VoiceConnectionStatus.Connecting) {
					debug("ボイスコネクションが接続中なので、Ready状態になるのを待つのだ");
					connection.once(VoiceConnectionStatus.Ready, () => {
						debug("ボイスコネクションが Ready になったのだ！再試行するのだ");
						playAudio(connection, audioBuffer).then(resolve).catch(reject);
					});
					return;
				}

				// 重大な問題がある場合は再接続を試みる
				if (
					connection.state.status === VoiceConnectionStatus.Disconnected ||
					connection.state.status === VoiceConnectionStatus.Destroyed
				) {
					warn("ボイスコネクションが切断されているのだ、再接続を試みるのだ");
					try {
						connection.rejoin();
						debug("ボイスコネクションの再接続を試みたのだ");
					} catch (err) {
						error("ボイスコネクションの再接続に失敗したのだ:", err);
						reject(new Error("ボイスコネクションの再接続に失敗したのだ"));
						return;
					}
				}
			}

			let player = players.get(guildId);

			if (player) {
				debug(`ギルドID: ${guildId} の既存プレイヤーを使用するのだ (状態: ${player.state.status})`);

				// プレイヤーが別の音声を再生中の場合は一度停止する
				if (player.state.status !== AudioPlayerStatus.Idle) {
					debug(
						`プレイヤーが他の音声を再生中なので一旦停止するのだ (現在の状態: ${player.state.status})`,
					);
					player.stop();
				}
			} else {
				debug(`ギルドID: ${guildId} の新しいプレイヤーを作成するのだ`);
				// NoSubscriberBehaviorを指定して安定性を向上
				player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Play,
					},
				});
				players.set(guildId, player);
				debug(
					`ボイスコネクションをプレイヤーに購読させるのだ (接続状態: ${connection.state.status})`,
				);
				connection.subscribe(player);
			}

			// すべての状態変化をデバッグする
			player.on("stateChange", (oldState, newState) => {
				debug(`プレイヤー状態変化 [拡張]: ${oldState.status} → ${newState.status}`);
				if (newState.status === AudioPlayerStatus.Playing) {
					debug("音声の再生が開始されたのだ！");
				} else if (newState.status === AudioPlayerStatus.Buffering) {
					debug("音声データをバッファリング中なのだ...");
				}
			});

			// エラー監視を強化
			player.on("error", (err) => {
				error(`プレイヤーでエラーが発生したのだ: ${err.message}`);
			});

			// デバッグ用ファイルを保存するかどうか（true = ファイル保存、false = メモリ内処理）
			const shouldSaveFile = true;
			let debugFilePath: string | null = null;

			// 音声を再生
			createAndPlayAudio(player, audioBuffer, shouldSaveFile)
				.then((filePath) => {
					debugFilePath = filePath || null;
				})
				.catch((error) => {
					console.error("音声リソースの作成中にエラーが発生したのだ:", error);
					debug(
						`音声リソース作成エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
					);
					reject(error);
				});

			debug("stateChangeイベントリスナーを設定するのだ (完了検出用)");
			// 一度だけ実行されるリスナーで完了を検出
			player.once("stateChange", (oldState, newState) => {
				debug(`プレイヤーの状態が変化したのだ: ${oldState.status} → ${newState.status}`);

				// Buffering状態に移行したら、再生またはアイドル状態への移行を監視
				if (newState.status === AudioPlayerStatus.Buffering) {
					debug("音声がバッファリング中なのだ、再生開始を待つのだ...");

					// Buffering -> Playing への遷移を監視
					const checkPlaying = (
						o: { status: AudioPlayerStatus },
						n: { status: AudioPlayerStatus },
					) => {
						debug(`ステート確認: ${o.status} → ${n.status}`);
						if (n.status === AudioPlayerStatus.Playing) {
							debug("バッファリングから再生状態へ移行したのだ！");
							player.off("stateChange", checkPlaying);
						} else if (n.status === AudioPlayerStatus.Idle) {
							debug("バッファリングからアイドル状態に戻ったのだ（再生されなかった）");
							// 何らかの理由で再生されなかった場合はここでクリーンアップ
							// デバッグのためにファイルを残す（通常は削除するべき）
							// if (debugFilePath && shouldSaveFile) {
							//   try {
							//     unlinkSync(debugFilePath);
							//   } catch (err) {
							//     debug(`デバッグファイルの削除に失敗したのだ: ${err instanceof Error ? err.message : "不明なエラー"}`);
							//   }
							// }
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
					// デバッグのためにファイルを残す（通常は削除するべき）
					// if (debugFilePath && shouldSaveFile) {
					//   debug(`再生完了したのでデバッグファイルを削除するのだ: ${debugFilePath}`);
					//   try {
					//     unlinkSync(debugFilePath);
					//   } catch (error) {
					//     debug(`デバッグファイルの削除に失敗したのだ: ${error instanceof Error ? error.message : "不明なエラー"}`);
					//   }
					// }
					debug("音声再生が完了したのだ");
					resolve();
				}
			});

			debug("errorイベントリスナーを設定するのだ");
			player.once("error", (error) => {
				console.error("音声の再生中にエラーが発生したのだ:", error);
				debug(`音声再生エラー: ${error.message || "不明なエラー"}`);
				reject(error);
			});
		} catch (error) {
			console.error("音声リソースの作成中にエラーが発生したのだ:", error);
			debug(
				`playAudio全体でエラーが発生したのだ: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
			reject(error);
		}
	});
}

export function stopAudio(guildId: string): void {
	const player = players.get(guildId);
	if (player) {
		debug(`ギルドID: ${guildId} の音声再生を停止するのだ`);
		player.stop();
	}
}

export function getPlayer(guildId: string): AudioPlayer | undefined {
	return players.get(guildId);
}
		} catch (error) {
			console.error("音声リソースの作成中にエラーが発生したのだ:", error);
			debug(
				`playAudio全体でエラーが発生したのだ: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
			reject(error);
		}
	});
}

export function stopAudio(guildId: string): void {
	const player = players.get(guildId);
	if (player) {
		debug(`ギルドID: ${guildId} の音声再生を停止するのだ`);
		player.stop();
	}
}

export function getPlayer(guildId: string): AudioPlayer | undefined {
	return players.get(guildId);
}
