import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import { SPEED_OPTIONS, VOICES } from "../constants/index.js";
import { getUserSettings } from "../../../models/userSettings.js";

/**
 * 設定表示ハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 * @param userId ユーザーID
 */
export async function handleShowSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
): Promise<void> {
	const settings = getUserSettings(serverId, userId);
	const voice = VOICES.find((v) => v.id === settings.speakerId);
	const speed = SPEED_OPTIONS.find((s) => s.value === settings.speedScale) || { label: "カスタム" };

	const embed = new EmbedBuilder()
		.setTitle("🔧 ずんだもんの設定なのだ")
		.setDescription("現在の設定だよ")
		.setColor(0x7cfc00) // 薄緑色
		.addFields(
			{
				name: "👤 ユーザー",
				value: `<@${userId}>`,
				inline: true,
			},
			{
				name: "🔊 声のタイプ",
				value: voice ? `${voice.name}（${voice.style}）` : "不明",
				inline: true,
			},
			{
				name: "⏩ 読み上げ速度",
				value: speed.label,
				inline: true,
			},
			{
				name: "🟢 読み上げ状態",
				value: settings.enabled ? "有効" : "無効",
				inline: true,
			},
		);

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
}
