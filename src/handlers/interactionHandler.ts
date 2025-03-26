import { DiscordAPIError, type Interaction, InteractionType } from "discord.js";
import { VOICES } from "../commands/settings";
import { getUserSettings, updateUserSettings } from "../models/userSettings";
import { error, info, log, warn } from "../utils/logger";
import { commands } from "./commands";

/**
 * コマンドインタラクションを処理するのだ
 */
async function handleCommandInteraction(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		warn(`存在しないコマンド ${interaction.commandName} が呼び出されました`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		error("コマンド実行中にエラーが発生しました", err);

		const response = { content: "コマンドの実行中にエラーが発生しました", ephemeral: true };

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(response);
		} else {
			await interaction.reply(response);
		}
	}
}

/**
 * スタイルメニューのインタラクションを処理するのだ
 */
async function handleStyleMenuInteraction(interaction: Interaction) {
	if (!interaction.isStringSelectMenu()) return;

	const customId = interaction.customId;
	// カスタムIDは "styleMenu-{serverId}-{userId}" の形式
	const parts = customId.split("-");

	if (parts.length !== 3 || parts[0] !== "styleMenu") {
		warn(`不正なカスタムID: ${customId}`);
		return;
	}

	const serverId = parts[1];
	const userId = parts[2];
	const selectedVoiceId = interaction.values[0];

	if (!serverId || !userId || !selectedVoiceId) {
		warn("選択メニューから必要な情報が取得できませんでした");
		return;
	}

	try {
		// 選択された声を見つける
		const selectedVoice = VOICES.find((voice) => voice.id.toString() === selectedVoiceId);

		if (!selectedVoice) {
			warn(`選択された声IDが見つかりません: ${selectedVoiceId}`);
			await interaction.reply({
				content: "選択された声が見つかりませんでした。",
				ephemeral: true,
			});
			return;
		}

		// ユーザー設定を更新
		await updateUserSettings(serverId, userId, {
			speakerId: selectedVoice.id,
		});

		info(`ユーザー ${userId} の声を ${selectedVoice.name}（${selectedVoice.style}）に変更しました`);

		await interaction.reply({
			content: `声を「${selectedVoice.name}（${selectedVoice.style}）」に変更しました。`,
			ephemeral: true,
		});
	} catch (err) {
		error("スタイルメニュー処理中にエラーが発生しました", err);
		await interaction.reply({
			content: "設定の更新中にエラーが発生しました。",
			ephemeral: true,
		});
	}
}

/**
 * すべてのインタラクションを処理するのだ
 */
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
	} catch (err) {
		if (err instanceof DiscordAPIError && err.code === 40060) {
			warn("インタラクションが既に返信済みまたは期限切れです");
			return;
		}

		error("インタラクション処理中に予期せぬエラーが発生しました", err);

		try {
			if (interaction.isRepliable() && !interaction.replied) {
				await interaction.reply({
					content: "予期せぬエラーが発生しました。",
					ephemeral: true,
				});
			}
		} catch (replyError) {
			error("エラー通知の返信に失敗しました", replyError);
		}
	}
}
