import type { Message } from "discord.js";

/**
 * メッセージテキストを読み上げ用に整形する
 * @param message Discordのメッセージオブジェクト
 * @returns 整形されたテキスト
 */
export function formatMessage(message: Message): string {
	let text = message.content;

	// URLを処理
	text = formatUrls(text);

	// 絵文字を処理
	text = formatEmojis(text);

	// メンションを処理
	text = formatMentions(text, message);

	// チャンネルメンションを処理
	text = formatChannelMentions(text, message);

	// 空白文字を整理
	text = formatWhitespace(text);

	return text || "";
}

/**
 * URLを「URL」に置換する
 * @param text 処理するテキスト
 * @returns 処理後のテキスト
 */
export function formatUrls(text: string): string {
	return text.replace(/https?:\/\/\S+/g, "URL");
}

/**
 * Discord絵文字を除去する
 * @param text 処理するテキスト
 * @returns 処理後のテキスト
 */
export function formatEmojis(text: string): string {
	// カスタム絵文字を削除
	return text.replace(/<a?:\w+:\d+>/g, "");
}

/**
 * ユーザーメンションを表示名に置換する
 * @param text 処理するテキスト
 * @param message メッセージオブジェクト（ユーザー情報取得用）
 * @returns 処理後のテキスト
 */
export function formatMentions(text: string, message: Message): string {
	return text.replace(/<@!?(\d+)>/g, (_match, id) => {
		const member = message.guild?.members.cache.get(id);
		return member ? `${member.displayName}さん` : "";
	});
}

/**
 * チャンネルメンションをチャンネル名に置換する
 * @param text 処理するテキスト
 * @param message メッセージオブジェクト（チャンネル情報取得用）
 * @returns 処理後のテキスト
 */
export function formatChannelMentions(text: string, message: Message): string {
	return text.replace(/<#(\d+)>/g, (_match, id) => {
		const channel = message.guild?.channels.cache.get(id);
		return channel ? `${channel.name}チャンネル` : "";
	});
}

/**
 * 空白文字を整理する
 * @param text 処理するテキスト
 * @returns 処理後のテキスト
 */
export function formatWhitespace(text: string): string {
	return text.trim().replace(/\s+/g, " ");
}
