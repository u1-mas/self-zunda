import { getVoiceConnection } from "@discordjs/voice";
import { type Message, TextChannel } from "discord.js";
import { isTextToSpeechEnabled } from "../models/activeChannels";
import { playAudio } from "../utils/audio";
import { error, warn } from "../utils/logger";
import { formatMessage } from "../utils/messageFormatter";
import { generateVoice } from "../utils/voicevox";

/**
 * メッセージ処理のエラー型定義
 */
export enum MessageProcessingErrorType {
	/** ボイスコネクションがない */
	NO_CONNECTION = "NO_CONNECTION",
	/** ユーザーの読み上げが無効 */
	USER_DISABLED = "USER_DISABLED",
	/** 音声合成に失敗 */
	SYNTHESIS_FAILED = "SYNTHESIS_FAILED",
	/** 音声再生に失敗 */
	PLAYBACK_FAILED = "PLAYBACK_FAILED",
}

/**
 * メッセージ処理のエラークラス
 */
export class MessageProcessingError extends Error {
	type: MessageProcessingErrorType;

	constructor(message: string, type: MessageProcessingErrorType) {
		super(message);
		this.name = "MessageProcessingError";
		this.type = type;
	}
}

/**
 * メッセージの読み上げ処理
 * @param message Discordのメッセージオブジェクト
 * @returns Promise<void>
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> TODO: なんとかする
export async function handleMessage(message: Message): Promise<void> {
	try {
		// 読み上げ処理の前提条件をチェック
		// 条件が満たされない場合は早期リターン
		if (!validateMessageForProcessing(message)) {
			return;
		}

		// この時点でmessage.guildは必ず存在する（validateMessageForProcessingで確認済み）
		const guildId = message.guild?.id;
		if (!guildId) {
			return; // 型安全のために追加（実行されないはず）
		}

		// メッセージを整形
		const text = formatMessage(message);
		if (!text) return;

		// ボイスコネクションを取得
		const connection = getVoiceConnection(guildId);
		if (!connection) {
			warn("ボイスコネクションが見つからないのだ！");
			return;
		}

		// 音声を生成して再生
		try {
			const audioBuffer = await generateVoice(text, guildId, message.author.id);
			await playAudio(connection, Buffer.from(audioBuffer));
		} catch (err) {
			// VOICEVOXのエラーメッセージからユーザー無効エラーを検出
			if (err instanceof Error && err.message.includes("ユーザーの読み上げが無効")) {
				warn(`ユーザー ${message.author.tag} の読み上げが無効になっているのだ`);
				return;
			}

			// エラーメッセージ送信
			error(
				`音声合成に失敗したのだ: ${err instanceof Error ? err.message : "予期せぬエラーが発生したのだ"}`,
			);

			// ユーザーへの通知
			if (message.channel instanceof TextChannel) {
				try {
					await message.channel.send(
						`メッセージの読み上げに失敗したのだ: ${err instanceof Error ? err.message : "予期せぬエラーが発生したのだ"}`,
					);
				} catch (notificationErr) {
					error(`エラー通知の送信にも失敗したのだ: ${notificationErr}`);
				}
			}
		}
	} catch (err) {
		// 予期せぬエラーのハンドリング
		error(`メッセージ処理で予期せぬエラーが発生したのだ: ${err}`);
	}
}

/**
 * メッセージが読み上げ可能か検証する
 * @param message Discordのメッセージオブジェクト
 * @returns boolean 読み上げ可能な場合はtrue
 */
function validateMessageForProcessing(message: Message): boolean {
	// ボットのメッセージは無視
	if (message.author.bot) {
		return false;
	}

	// DMは無視
	if (!message.guild) {
		return false;
	}

	// チャンネルが有効化されているか確認
	if (!isTextToSpeechEnabled(message.guild.id, message.channel.id)) {
		return false;
	}

	return true;
}
