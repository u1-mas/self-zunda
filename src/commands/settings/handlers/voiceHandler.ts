import type { ChatInputCommandInteraction } from "discord.js";
import { VOICES } from "../constants/index.js";
import { updateUserSettings } from "../../../models/userSettings.js";

/**
 * 声のタイプ設定ハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 * @param userId ユーザーID
 */
export async function handleVoiceSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
): Promise<void> {
	const voiceType = interaction.options.getInteger("speaker", true);

	// 存在する声のタイプか確認
	const voiceInfo = VOICES.find((v) => v.id === voiceType);
	if (!voiceInfo) {
		await interaction.reply({
			content: "その声は使えないのだ...",
			ephemeral: true,
		});
		return;
	}

	// 設定を更新
	updateUserSettings(serverId, userId, { speakerId: voiceType });

	await interaction.reply({
		content: `声を ${voiceInfo.name}（${voiceInfo.style}）に変更したのだ！`,
		ephemeral: true,
	});
}
