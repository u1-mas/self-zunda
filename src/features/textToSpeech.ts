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
export async function handleMessage(message: Message): Promise<void> {
	try {
		// 読み上げ処理の前提条件をチェック
		await validateMessageForProcessing(message);

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
			throw new MessageProcessingError(
				"ボイスコネクションが見つからないのだ！",
				MessageProcessingErrorType.NO_CONNECTION,
			);
		}

		// 音声を生成して再生
		try {
			const audioBuffer = await generateVoice(text, guildId, message.author.id);
			await playAudio(connection, audioBuffer);
		} catch (err) {
			// VOICEVOXのエラーメッセージからユーザー無効エラーを検出
			if (err instanceof Error && err.message.includes("ユーザーの読み上げが無効")) {
				throw new MessageProcessingError(err.message, MessageProcessingErrorType.USER_DISABLED);
			}

			throw new MessageProcessingError(
				`音声合成に失敗したのだ: ${err instanceof Error ? err.message : "予期せぬエラーが発生したのだ"}`,
				MessageProcessingErrorType.SYNTHESIS_FAILED,
			);
		}
	} catch (err) {
		// エラー処理
		await handleMessageError(err, message);
	}
}

/**
 * メッセージが読み上げ可能か検証する
 * @param message Discordのメッセージオブジェクト
 * @throws MessageProcessingError 検証に失敗した場合
 */
async function validateMessageForProcessing(message: Message): Promise<void> {
	// ボットのメッセージは無視
	if (message.author.bot) {
		throw new MessageProcessingError(
			"ボットのメッセージは読み上げないのだ",
			MessageProcessingErrorType.USER_DISABLED,
		);
	}

	// DMは無視
	if (!message.guild) {
		throw new MessageProcessingError(
			"DMでは読み上げできないのだ",
			MessageProcessingErrorType.NO_CONNECTION,
		);
	}

	// チャンネルが有効化されているか確認
	if (!isTextToSpeechEnabled(message.guild.id, message.channel.id)) {
		throw new MessageProcessingError(
			"このチャンネルでは読み上げが有効になっていないのだ",
			MessageProcessingErrorType.NO_CONNECTION,
		);
	}
}

/**
 * メッセージ処理のエラーを処理する
 * @param err エラーオブジェクト
 * @param message Discordのメッセージオブジェクト
 */
async function handleMessageError(err: unknown, message: Message): Promise<void> {
	// 拒否されただけなら何もしない（ボットメッセージや無効なチャンネルなど）
	if (!(err instanceof MessageProcessingError)) {
		return;
	}

	// エラータイプに応じたエラーログ
	switch (err.type) {
		case MessageProcessingErrorType.NO_CONNECTION:
			error("ボイスコネクションが見つからないのだ！再接続するか確認するのだ");
			break;
		case MessageProcessingErrorType.USER_DISABLED:
			// ユーザー無効は警告レベル
			warn(`ユーザー ${message.author.tag} の読み上げが無効になっているのだ`);
			return; // ユーザーへの通知はしない
		case MessageProcessingErrorType.SYNTHESIS_FAILED:
			error(`音声合成に失敗したのだ: ${err.message}`);
			break;
		case MessageProcessingErrorType.PLAYBACK_FAILED:
			error(`音声再生に失敗したのだ: ${err.message}`);
			break;
		default:
			error(`メッセージの読み上げに失敗したのだ: ${err.message}`);
	}

	// ユーザーへの通知
	if (message.channel instanceof TextChannel) {
		try {
			await message.channel.send(`メッセージの読み上げに失敗したのだ: ${err.message}`);
		} catch (notificationErr) {
			error(`エラー通知の送信にも失敗したのだ: ${notificationErr}`);
		}
	}
}
