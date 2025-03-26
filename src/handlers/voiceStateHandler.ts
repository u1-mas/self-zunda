import { getVoiceConnection } from "@discordjs/voice";
import type { VoiceState } from "discord.js";
import { playAudio } from "../utils/audio.ts";
import { error } from "../utils/logger.ts";
import { generateVoice } from "../utils/voicevox.ts";

export async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
	if (newState.member?.user.bot) {
		return;
	}

	if (oldState.channelId !== newState.channelId) {
		const connection = getVoiceConnection(newState.guild.id);
		if (!connection) {
			return;
		}

		try {
			const memberName = newState.member?.displayName || "不明なユーザー";

			if (newState.channelId) {
				const text = `${memberName}が参加したのだ！`;
				const audioBuffer = await generateVoice(text);
				await playAudio(connection, Buffer.from(audioBuffer));
			} else if (oldState.channelId) {
				const text = `${memberName}が抜けたのだ！`;
				const audioBuffer = await generateVoice(text);
				await playAudio(connection, Buffer.from(audioBuffer));
			}
		} catch (err) {
			error("ボイスチャンネルの状態変更の読み上げに失敗したのだ:", err);
		}
	}
}
