import { getVoiceConnection } from "@discordjs/voice";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { disableTextToSpeech } from "../models/activeChannels.ts";
import { logger } from "../utils/logger.ts";

export const leave = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("ボイスチャンネルから退出するのだ"),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

		// コネクションを取得して切断
		const connection = getVoiceConnection(interaction.guild.id);

		if (connection) {
			connection.destroy();
			disableTextToSpeech(interaction.guild.id);
			logger.log(`サーバー「${interaction.guild.name}」のボイスチャンネルから退出したのだ！`);
			await interaction.reply({
				content: "ボイスチャンネルから退出したのだ！",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "ボイスチャンネルに参加していないのだ！",
				ephemeral: true,
			});
		}
	},
};
