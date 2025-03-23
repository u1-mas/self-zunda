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

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

async function createAndPlayAudio(
	player: AudioPlayer,
	tempFile: string,
	audioBuffer: Buffer,
): Promise<void> {
	// バッファを一時ファイルに保存
	await writeFile(tempFile, audioBuffer);

	// ファイルからストリームを作成
	const stream = createReadStream(tempFile);

	const resource = createAudioResource(stream, {
		inputType: StreamType.Arbitrary,
	});

	player.play(resource);
}

export async function playAudio(connection: VoiceConnection, audioBuffer: Buffer): Promise<void> {
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

			createAndPlayAudio(player, tempFile, audioBuffer).catch((error) => {
				console.error("音声リソースの作成中にエラーが発生したのだ:", error);
				reject(error);
			});

			player.once("stateChange", (_oldState, newState) => {
				if (newState.status === AudioPlayerStatus.Idle) {
					// 一時ファイルを削除する処理を追加する（エラーハンドリングは省略）
					try {
						unlinkSync(tempFile);
					} catch (_error) {
						// ファイル削除に失敗してもエラーを無視
					}
					resolve();
				}
			});

			player.once("error", (error) => {
				console.error("音声の再生中にエラーが発生したのだ:", error);
				// エラー時も一時ファイルを削除
				try {
					unlinkSync(tempFile);
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
