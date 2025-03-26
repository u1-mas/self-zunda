import {
	ActionRowBuilder,
	type ChatInputCommandInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import { updateUserSettings } from "../../../models/userSettings.js";
import { logger } from "../../../utils/logger.js";
import { VOICES } from "../constants/index.js";

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
	logger.debug(`声の設定ハンドラーが呼び出されたのだ: ${serverId}, ${userId}`);

	const selectedSpeaker = interaction.options.getString("speaker", true);
	logger.debug(`選択された話者: ${selectedSpeaker}`);

	// 選択された話者の声の一覧を取得
	const speakerVoices = VOICES.filter((v) => v.name === selectedSpeaker);
	logger.debug(`選択された話者の声の数: ${speakerVoices.length}`);

	// スタイルが1つしかない場合は直接設定
	if (speakerVoices.length === 1) {
		const voice = speakerVoices[0];
		updateUserSettings(serverId, userId, { speakerId: voice.id });

		await interaction.reply({
			content: `声を「${voice.name}（${voice.style}）」に変更したのだ！`,
			ephemeral: true,
		});
		return;
	}

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

	await interaction.reply({
		content: `${selectedSpeaker}のスタイルを選択するのだ！`,
		components: [row],
		ephemeral: true,
	});
}
