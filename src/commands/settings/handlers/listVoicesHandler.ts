import type { ChatInputCommandInteraction } from "discord.js";
import { SPEAKERS } from "../constants/index.js";

/**
 * スピーカー一覧表示ハンドラー
 * @param interaction インタラクション
 */
export async function handleListVoices(interaction: ChatInputCommandInteraction): Promise<void> {
	// メッセージを作成
	const message = SPEAKERS.map((name) => `- ${name}`).join("\n");

	await interaction.reply({
		content: `利用可能なスピーカーの一覧なのだ！\n\n${message}\n\n※ 声を変更するには \`/settings voice\` コマンドを使用するのだ！`,
		ephemeral: true,
	});
}
