import {
	type AudioPlayer,
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	StreamType,
	type VoiceConnection,
} from "@discordjs/voice";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";

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

export async function playAudio(
	connection: VoiceConnection,
	audioBuffer: Buffer,
): Promise<void> {
	try {
		// 音声プレーヤーを作成
		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		// BufferをReadableに変換
		const stream = Readable.from(audioBuffer);

		// 音声リソースを作成
		const resource = createAudioResource(stream);

		// 音声を再生
		player.play(resource);
		connection.subscribe(player);

		// 再生が終了したら切断
		player.on("stateChange", (oldState, newState) => {
			if (newState.status === "idle") {
				connection.destroy();
			}
		});
	} catch (error) {
		console.error("音声再生に失敗したのだ:", error);
		throw error;
	}
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
