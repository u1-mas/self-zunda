import type { Message } from "discord.js";
import { handleMessage } from "../features/textToSpeech";

export async function handleMessageCreate(message: Message) {
	await handleMessage(message);
}
