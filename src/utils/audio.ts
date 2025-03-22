import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
	type AudioPlayer,
	StreamType,
	type VoiceConnection,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { writeFile } from "fs/promises";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

export async function playAudio(
	connection: VoiceConnection,
	audioBuffer: Buffer,
): Promise<void> {
	return new Promise(async (resolve, reject) => {
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
			await writeFile(tempFile, audioBuffer);

			// ファイルからストリームを作成
			const stream = createReadStream(tempFile);

			const resource = createAudioResource(stream, {
				inputType: StreamType.Arbitrary,
			});

			player.play(resource);

			player.once("stateChange", (oldState, newState) => {
				if (newState.status === "idle") {
					// 一時ファイルを削除する処理を追加する（エラーハンドリングは省略）
					try {
						require("fs").unlinkSync(tempFile);
					} catch (error) {
						console.error("一時ファイルの削除に失敗したのだ:", error);
					}
					resolve();
				}
			});

			player.once("error", (error) => {
				console.error("音声の再生中にエラーが発生したのだ:", error);
				// エラー時も一時ファイルを削除
				try {
					require("fs").unlinkSync(tempFile);
				} catch (deleteError) {
					console.error("一時ファイルの削除に失敗したのだ:", deleteError);
				}
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
