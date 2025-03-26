import type { ChatInputCommandInteraction } from "discord.js";
import { SPEAKERS, VOICES } from "../constants/index.js";
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
	const speakerName = interaction.options.getString("speaker", true);

	// 存在する声のタイプか確認
	const speakerInfo = SPEAKERS.find((s) => s === speakerName);
	const speakerId = VOICES.find((v) => v.name === speakerName)?.id;

	// 設定を更新
	updateUserSettings(serverId, userId, { speakerId });

	await interaction.reply({
		content: `声を ${speakerInfo} に変更したのだ！`,
		ephemeral: true,
	});
}
