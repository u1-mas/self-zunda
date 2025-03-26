import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";
import { logger } from "../../utils/logger.js";
import { VOICES, SPEED_OPTIONS } from "./constants/index.js";
import {
	handleVoiceSettings,
	handleStyleSettings,
	handleSpeedSettings,
	handleShowSettings,
	handleToggleReadingEnabled,
	handleServerDefaultSettings,
} from "./handlers/index.js";

const commandData = new SlashCommandBuilder()
	.setName("settings")
	.setDescription("ずんだもんの設定を変更するのだ")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("voice")
			.setDescription("声のタイプを変更するのだ")
			.addIntegerOption((option) =>
				option
					.setName("speaker")
					.setDescription("声のタイプを選ぶのだ")
					.setRequired(true)
					.addChoices(
						{ name: "ずんだもん", value: 1 },
						{ name: "四国めたん", value: 2 },
						{ name: "春日部つむぎ", value: 8 },
						{ name: "雨晴はう", value: 9 },
						{ name: "波音リツ", value: 10 },
						...VOICES.map((voice) => ({
							name: `${voice.name}（${voice.style}）`,
							value: voice.id,
						})),
					),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("style")
			.setDescription("声のスタイルを変更するのだ")
			.addStringOption((option) =>
				option
					.setName("speaker")
					.setDescription("話者を選ぶのだ")
					.setRequired(true)
					.addChoices(
						...VOICES.map((voice) => ({
							name: voice.name,
							value: voice.name,
						})),
					),
			)
			.addStringOption((option) =>
				option.setName("style").setDescription("スタイルを選ぶのだ").setRequired(true),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("speed")
			.setDescription("読み上げ速度を変更するのだ")
			.addNumberOption((option) =>
				option
					.setName("value")
					.setDescription("読み上げ速度を選ぶのだ")
					.setRequired(true)
					.addChoices(
						...SPEED_OPTIONS.map((speed) => ({
							name: speed.label,
							value: speed.value,
						})),
					),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("show").setDescription("現在の設定を表示するのだ"),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("toggle").setDescription("読み上げの有効/無効を切り替えるのだ"),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("server-default")
			.setDescription("サーバーのデフォルト声を設定するのだ（管理者のみ）")
			.addIntegerOption((option) =>
				option
					.setName("speaker")
					.setDescription("デフォルトの声のタイプを選ぶのだ")
					.setRequired(true)
					.addChoices(
						...VOICES.map((voice) => ({
							name: `${voice.name}（${voice.style}）`,
							value: voice.id,
						})),
					),
			),
	);

export const settings: Command = {
	data: commandData as unknown as SlashCommandBuilder,

	execute: async (interaction: ChatInputCommandInteraction) => {
		try {
			const subcommand = interaction.options.getSubcommand();
			const serverId = interaction.guildId || "DM";
			const userId = interaction.user.id;

			switch (subcommand) {
				case "voice":
					await handleVoiceSettings(interaction, serverId, userId);
					break;
				case "style":
					await handleStyleSettings(interaction, serverId, userId);
					break;
				case "speed":
					await handleSpeedSettings(interaction, serverId, userId);
					break;
				case "show":
					await handleShowSettings(interaction, serverId, userId);
					break;
				case "toggle":
					await handleToggleReadingEnabled(interaction, serverId, userId);
					break;
				case "server-default":
					await handleServerDefaultSettings(interaction, serverId);
					break;
				default:
					await interaction.reply({
						content: "知らないサブコマンドなのだ...",
						ephemeral: true,
					});
			}
		} catch (err) {
			logger.error(`設定コマンドの実行中にエラーが発生したのだ: ${err}`);
			await interaction.reply({
				content: "設定の変更中にエラーが発生したのだ...",
				ephemeral: true,
			});
		}
	},
};
