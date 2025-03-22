import {
	type AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	StreamType,
	type VoiceConnection,
} from "@discordjs/voice";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

export async function playAudio(
	connection: VoiceConnection,
	audioBuffer: Buffer,
): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const guildId = connection.joinConfig.guildId;
			let player = players.get(guildId);

			if (!player) {
				player = createAudioPlayer();
				players.set(guildId, player);
				connection.subscribe(player);
			}

			// 一時ファイルのパスを生成
			const tempFile = join(tmpdir(), `${randomUUID()}.wav`);

			// バッファを一時ファイルに保存
			writeFile(tempFile, audioBuffer)
				.then(() => {
					// ファイルからストリームを作成
					const stream = createReadStream(tempFile);

					const resource = createAudioResource(stream, {
						inputType: StreamType.Arbitrary,
					});

					player.play(resource);

					player.once("stateChange", (oldState, newState) => {
						if (newState.status === AudioPlayerStatus.Idle) {
							// 一時ファイルを削除する処理を追加する（エラーハンドリングは省略）
							try {
								require("node:fs").unlinkSync(tempFile);
							} catch (error) {
								console.error(
									"一時ファイルの削除に失敗したのだ:",
									error,
								);
							}
							resolve();
						}
					});

					player.once("error", (error) => {
						console.error(
							"音声の再生中にエラーが発生したのだ:",
							error,
						);
						// エラー時も一時ファイルを削除
						try {
							require("node:fs").unlinkSync(tempFile);
						} catch (deleteError) {
							console.error(
								"一時ファイルの削除に失敗したのだ:",
								deleteError,
							);
						}
						reject(error);
					});
				})
				.catch((error) => {
					console.error(
						"音声リソースの作成中にエラーが発生したのだ:",
						error,
					);
					reject(error);
				});
		} catch (error) {
			console.error("音声リソースの作成中にエラーが発生したのだ:", error);
			reject(error);
		}
	});
}

export function stopAudio(guildId: string): void {
	const player = players.get(guildId);
	if (player) {
		player.stop();
	}
}

export function getPlayer(guildId: string): AudioPlayer | undefined {
	return players.get(guildId);
}
