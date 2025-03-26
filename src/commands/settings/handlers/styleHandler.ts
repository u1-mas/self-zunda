import {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { VOICES } from "../constants/index.js";
import { updateUserSettings } from "../../../models/userSettings.js";

/**
 * スタイル設定ハンドラー
 * @param interaction インタラクション
 * @param serverId サーバーID
 * @param userId ユーザーID
 */
export async function handleStyleSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
): Promise<void> {
	const speakerName = interaction.options.getString("speaker", true);
	const requestedStyle = interaction.options.getString("style", true);

	// 話者の声のスタイル一覧を取得
	const speakerVoices = VOICES.filter((v) => v.name === speakerName);

	if (speakerVoices.length === 0) {
		await interaction.reply({
			content: "その話者は存在しないのだ...",
			ephemeral: true,
		});
		return;
	}

	// リクエストされたスタイルに対応する声を検索
	const selectedVoice = speakerVoices.find((v) => v.style === requestedStyle);

	if (selectedVoice) {
		// 設定を更新
		updateUserSettings(serverId, userId, { speakerId: selectedVoice.id });

		await interaction.reply({
			content: `声を ${selectedVoice.name}（${selectedVoice.style}）に変更したのだ！`,
			ephemeral: true,
		});
		return;
	}

	// リクエストされたスタイルが見つからない場合
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

	// 利用可能なスタイル一覧
	const availableStyles = speakerVoices.map((v) => v.style);

	await interaction.reply({
		content: `「${requestedStyle}」というスタイルは「${speakerName}」にはないのだ。\n利用可能なスタイル: ${availableStyles.join(", ")}`,
		components: [row],
		ephemeral: true,
	});
}
