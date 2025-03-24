import type { Message } from "discord.js";
import { handleMessage } from "../features/textToSpeech";
import { error } from "../utils/logger";

export async function handleMessageCreate(message: Message) {
	try {
		await handleMessage(message);
	} catch (err) {
		error("メッセージの処理中にエラーが発生したのだ:", err);
	}
}
