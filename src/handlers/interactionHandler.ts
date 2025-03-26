import {
	ActionRowBuilder,
	DiscordAPIError,
	type Interaction,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import { VOICES } from "../commands/settings/constants/index.ts";
import { updateUserSettings } from "../models/userSettings.ts";
import { logger } from "../utils/logger.ts";
import { commands } from "./commands.ts";

/**
 * エラー応答を送信するのだ
 * DiscordAPIError 40060は無視する
 */
async function sendErrorResponse(interaction: Interaction, message: string) {
	const response = { content: message, ephemeral: true };

	try {
		if (interaction.isRepliable()) {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(response);
			} else {
				await interaction.reply(response);
			}
		}
	} catch (replyErr) {
		// すでに応答済みのエラー（40060）は無視
		if (replyErr instanceof DiscordAPIError && replyErr.code === 40060) {
			logger.warn("インタラクションが既に返信済みまたは期限切れです");
			return;
		}
		logger.error("エラー通知の返信に失敗しました", replyErr);
	}
}

/**
 * コマンドインタラクションを処理するのだ
 */
async function handleCommandInteraction(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const command = commands.get(interaction.commandName);

	if (!command) {
		logger.warn(`存在しないコマンド ${interaction.commandName} が呼び出されました`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		// 40060エラーは無視（すでに返信済み）
		if (err instanceof DiscordAPIError && err.code === 40060) {
			logger.warn("インタラクションが既に返信済みまたは期限切れです");
			return;
		}

		logger.error("コマンド実行中にエラーが発生しました", err);
		await sendErrorResponse(interaction, "コマンドの実行中にエラーが発生しました");
	}
}

/**
 * 話者メニューのインタラクションを処理するのだ
 */
async function handleVoiceMenuInteraction(interaction: Interaction) {
	if (!interaction.isStringSelectMenu()) {
		return;
	}

	const customId = interaction.customId;
	// カスタムIDは "voiceMenu-{serverId}-{userId}" の形式
	const parts = customId.split("-");

	if (parts.length !== 3 || parts[0] !== "voiceMenu") {
		logger.warn(`不正なカスタムID: ${customId}`);
		return;
	}

	const serverId = parts[1];
	const userId = parts[2];
	const selectedSpeaker = interaction.values[0];

	if (!(serverId && userId && selectedSpeaker)) {
		logger.warn("選択メニューから必要な情報が取得できませんでした");
		return;
	}

	try {
		// 選択された話者の声の一覧を取得
		const speakerVoices = VOICES.filter((v) => v.name === selectedSpeaker);

		// スタイル選択メニューを作成
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(`styleMenu-${serverId}-${userId}`)
			.setPlaceholder("スタイルを選択するのだ")
			.addOptions(
				speakerVoices.map((v) =>
					new StringSelectMenuOptionBuilder()
						.setLabel(`${v.style}`)
						.setDescription(`${v.name}の${v.style}ボイス`)
						.setValue(v.id.toString()),
				),
			);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		await interaction.update({
			content: `${selectedSpeaker}のスタイルを選択するのだ！`,
			components: [row],
		});
	} catch (err) {
		logger.error("話者メニュー処理中にエラーが発生しました", err);
		await sendErrorResponse(interaction, "設定の更新中にエラーが発生しました。");
	}
}

/**
 * スタイルメニューのインタラクションを処理するのだ
 */
async function handleStyleMenuInteraction(interaction: Interaction) {
	if (!interaction.isStringSelectMenu()) {
		return;
	}

	const customId = interaction.customId;
	// カスタムIDは "styleMenu-{serverId}-{userId}" の形式
	const parts = customId.split("-");

	if (parts.length !== 3 || parts[0] !== "styleMenu") {
		logger.warn(`不正なカスタムID: ${customId}`);
		return;
	}

	const serverId = parts[1];
	const userId = parts[2];
	const selectedVoiceId = interaction.values[0];

	if (!(serverId && userId && selectedVoiceId)) {
		logger.warn("選択メニューから必要な情報が取得できませんでした");
		return;
	}

	try {
		// 選択された声を見つける
		const selectedVoice = VOICES.find(
			(voice: { id: number; name: string; style: string }) =>
				voice.id.toString() === selectedVoiceId,
		);

		if (!selectedVoice) {
			logger.warn(`選択された声IDが見つかりません: ${selectedVoiceId}`);
			await sendErrorResponse(interaction, "選択された声が見つかりませんでした。");
			return;
		}

		// ユーザー設定を更新
		updateUserSettings(serverId, userId, {
			speakerId: selectedVoice.id,
		});

		logger.info(
			`ユーザー ${userId} の声を ${selectedVoice.name}（${selectedVoice.style}）に変更しました`,
		);

		await interaction.update({
			content: `声を「${selectedVoice.name}（${selectedVoice.style}）」に変更したのだ！`,
			components: [],
		});
	} catch (err) {
		logger.error("スタイルメニュー処理中にエラーが発生しました", err);
		await sendErrorResponse(interaction, "設定の更新中にエラーが発生しました。");
	}
}

export async function handleInteraction(interaction: Interaction) {
	try {
		// コマンドインタラクションの処理
		if (interaction.isChatInputCommand()) {
			await handleCommandInteraction(interaction);
			return;
		}

		// スタイルメニューインタラクションの処理
		if (interaction.isStringSelectMenu() && interaction.customId.startsWith("styleMenu-")) {
			await handleStyleMenuInteraction(interaction);
			return;
		}

		// 話者メニューインタラクションの処理
		if (interaction.isStringSelectMenu() && interaction.customId.startsWith("voiceMenu-")) {
			await handleVoiceMenuInteraction(interaction);
			return;
		}
	} catch (err) {
		if (typeof err === "object" && err !== null && "code" in err && err.code === 40060) {
			// すでに返信済みのエラーは無視
			return;
		}

		logger.error("インタラクション処理中に予期せぬエラーが発生しました", err);
		await sendErrorResponse(interaction, "予期せぬエラーが発生しました。");
	}
}
