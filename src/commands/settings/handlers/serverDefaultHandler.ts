import type { ChatInputCommandInteraction } from "discord.js";
import { setServerDefaultSpeaker } from "../../../models/userSettings";
import { VOICES } from "../constants";

/**
 * サーバーデフォルト設定ハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 */
export async function handleServerDefaultSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
): Promise<void> {
	// サーバーでない場合は設定不可
	if (serverId === "DM") {
		await interaction.reply({
			content: "この設定はサーバーでのみ使用できるのだ！",
			ephemeral: true,
		});
		return;
	}

	// 管理者権限を確認
	if (
		!interaction.memberPermissions?.has("Administrator") &&
		interaction.user.id !== interaction.client.application?.owner?.id
	) {
		await interaction.reply({
			content: "この設定は管理者のみが変更できるのだ！",
			ephemeral: true,
		});
		return;
	}

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

	// サーバーのデフォルト設定を更新
	setServerDefaultSpeaker(serverId, voiceType);

	await interaction.reply({
		content: `サーバーのデフォルト声を ${voiceInfo.name}（${voiceInfo.style}）に変更したのだ！`,
		ephemeral: true,
	});
}
