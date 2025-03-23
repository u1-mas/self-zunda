import { getVoiceConnection } from "@discordjs/voice";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getActiveChannels } from "../models/activeChannels";

export const status = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("現在の読み上げ状態を確認するのだ"),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

		const activeChannels = getActiveChannels();
		const guildConnection = getVoiceConnection(interaction.guild.id);
		const activeTextChannel = activeChannels.get(interaction.guild.id);

		if (!guildConnection || !activeTextChannel) {
			await interaction.reply({
				content: "現在、ボイスチャンネルに接続していないのだ！",
				ephemeral: true,
			});
			return;
		}

		await interaction.reply({
			content: `現在、<#${activeTextChannel}> の内容を読み上げているのだ！\n読み上げ設定を変更するには \`/settings\` コマンドを使用するのだ！`,
			ephemeral: true,
		});
	},
};
