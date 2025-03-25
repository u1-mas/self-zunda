import { randomUUID } from "node:crypto";
import { createReadStream, unlinkSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	type AudioPlayer,
	AudioPlayerStatus,
	StreamType,
	type VoiceConnection,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { debug, error } from "./logger";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

async function createAndPlayAudio(
	player: AudioPlayer,
	tempFile: string,
	audioBuffer: Buffer,
): Promise<void> {
	debug(
		`音声バッファを一時ファイル ${tempFile} に保存するのだ (サイズ: ${audioBuffer.length} バイト)`,
	);
	// バッファを一時ファイルに保存
	await writeFile(tempFile, audioBuffer);

	debug(`一時ファイルからストリームを作成するのだ: ${tempFile}`);
	// ファイルからストリームを作成
	const stream = createReadStream(tempFile);

	debug("音声リソースを作成するのだ");
	const resource = createAudioResource(stream, {
		inputType: StreamType.Arbitrary,
	});

	debug("音声の再生を開始するのだ");
	player.play(resource);
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

			let player = players.get(guildId);

			if (player) {
				debug(`ギルドID: ${guildId} の既存プレイヤーを使用するのだ (状態: ${player.state.status})`);
			} else {
				debug(`ギルドID: ${guildId} の新しいプレイヤーを作成するのだ`);
				player = createAudioPlayer();
				players.set(guildId, player);
				debug(
					`ボイスコネクションをプレイヤーに購読させるのだ (接続状態: ${connection.state.status})`,
				);
				connection.subscribe(player);
			}

			// 一時ファイルのパスを生成
			const tempFile = join(tmpdir(), `${randomUUID()}.wav`);
			debug(`一時ファイルを作成するのだ: ${tempFile}`);

			createAndPlayAudio(player, tempFile, audioBuffer).catch((error) => {
				console.error("音声リソースの作成中にエラーが発生したのだ:", error);
				debug(`音声リソース作成エラー: ${error instanceof Error ? error.message : "不明なエラー"}`);
				reject(error);
			});

			debug("stateChangeイベントリスナーを設定するのだ");
			player.once("stateChange", (oldState, newState) => {
				debug(`プレイヤーの状態が変化したのだ: ${oldState.status} → ${newState.status}`);
				if (newState.status === AudioPlayerStatus.Idle) {
					// 一時ファイルを削除する処理を追加する（エラーハンドリングは省略）
					debug(`再生完了したので一時ファイルを削除するのだ: ${tempFile}`);
					try {
						unlinkSync(tempFile);
					} catch (error) {
						debug(
							`一時ファイルの削除に失敗したのだ: ${error instanceof Error ? error.message : "不明なエラー"}`,
						);
						// ファイル削除に失敗してもエラーを無視
					}
					debug("音声再生が完了したのだ");
					resolve();
				}
			});

			debug("errorイベントリスナーを設定するのだ");
			player.once("error", (error) => {
				console.error("音声の再生中にエラーが発生したのだ:", error);
				debug(`音声再生エラー: ${error.message || "不明なエラー"}`);
				// エラー時も一時ファイルを削除
				try {
					unlinkSync(tempFile);
				} catch (deleteError) {
					console.error("一時ファイルの削除に失敗したのだ:", deleteError);
					debug(
						`エラー時の一時ファイル削除に失敗したのだ: ${deleteError instanceof Error ? deleteError.message : "不明なエラー"}`,
					);
				}
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
