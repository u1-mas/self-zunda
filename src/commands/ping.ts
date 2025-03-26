import { SlashCommandBuilder } from "discord.js";
import type { Command } from "./types.ts";

export const ping: Command = {
	data: new SlashCommandBuilder().setName("ping").setDescription("ぽんと返すのだ！"),

	async execute(interaction) {
		const sent = await interaction.reply({
			content: "Pingを計測中なのだ...",
			fetchReply: true,
		});
		const latency = sent.createdTimestamp - interaction.createdTimestamp;
		await interaction.editReply(
			`ぽんなのだ！ 🏓\nBotのレイテンシー: ${latency}ms\nWebSocket: ${interaction.client.ws.ping}ms`,
		);
	},
};
