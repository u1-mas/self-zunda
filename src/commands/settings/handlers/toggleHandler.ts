import type { ChatInputCommandInteraction } from "discord.js";
import { getUserSettings, updateUserSettings } from "../../../models/userSettings.js";

/**
 * 読み上げ有効/無効切り替えハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 * @param userId ユーザーID
 */
export async function handleToggleReadingEnabled(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
): Promise<void> {
	const currentSettings = getUserSettings(serverId, userId);
	const newEnabled = !currentSettings.enabled;

	// 設定を更新
	updateUserSettings(serverId, userId, { enabled: newEnabled });

	await interaction.reply({
		content: `読み上げを${newEnabled ? "有効" : "無効"}にしたのだ！`,
		ephemeral: true,
	});
}
