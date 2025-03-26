import type { ChatInputCommandInteraction } from "discord.js";
import { updateUserSettings } from "../../../models/userSettings";
import { SPEED_OPTIONS } from "../constants";

/**
 * 読み上げ速度設定ハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 * @param userId ユーザーID
 */
export async function handleSpeedSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
): Promise<void> {
	const speedValue = interaction.options.getNumber("value", true);

	// 有効な速度か確認
	const speedInfo = SPEED_OPTIONS.find((s) => s.value === speedValue);
	if (!speedInfo) {
		await interaction.reply({
			content: "その速度は使えないのだ...",
			ephemeral: true,
		});
		return;
	}

	// 設定を更新
	updateUserSettings(serverId, userId, { speedScale: speedValue });

	await interaction.reply({
		content: `読み上げ速度を「${speedInfo.label}」に変更したのだ！`,
		ephemeral: true,
	});
}
