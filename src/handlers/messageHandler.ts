import type { Message } from "discord.js";
import { handleMessage } from "../features/textToSpeech.ts";
import { error } from "../utils/logger.ts";

export async function handleMessageCreate(message: Message) {
	try {
		await handleMessage(message);
	} catch (err) {
		error("メッセージの処理中にエラーが発生したのだ:", err);
	}
}
