import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	type CommandInteraction,
	EmbedBuilder,
	SelectMenuBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import {
	getUserSettings,
	setServerDefaultSpeaker,
	updateUserSettings,
} from "../models/userSettings";
import { error, log } from "../utils/logger";
import type { Command } from "./types";

// 「声」のオプション一覧
// ID: ずんだもんのVOICEVOXでのスピーカーID
// NAME: 日本語での表示名
// STYLE: スタイルの説明
const VOICES = [
	{ id: 1, name: "ずんだもん", style: "あまあま" },
	{ id: 2, name: "ずんだもん", style: "ノーマル" },
	{ id: 3, name: "ずんだもん", style: "セクシー" },
	{ id: 8, name: "春日部つむぎ", style: "ノーマル" },
	{ id: 10, name: "波音リツ", style: "ノーマル" },
	{ id: 9, name: "雨晴はう", style: "ノーマル" },
	{ id: 7, name: "ちび式じい", style: "ノーマル" },
];

// 読み上げ速度のオプション一覧
const SPEED_OPTIONS = [
	{ value: 0.75, label: "遅い", description: "遅めの読み上げ速度" },
	{ value: 1.0, label: "普通", description: "標準的な読み上げ速度" },
	{ value: 1.25, label: "速い", description: "速めの読み上げ速度" },
	{ value: 1.5, label: "かなり速い", description: "かなり速い読み上げ速度" },
];

const commandData = new SlashCommandBuilder()
	.setName("settings")
	.setDescription("ずんだもんの設定を変更するのだ")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("voice")
			.setDescription("声のタイプを変更するのだ")
			.addIntegerOption((option) =>
				option
					.setName("type")
					.setDescription("声のタイプを選ぶのだ")
					.setRequired(true)
					.addChoices(
						...VOICES.map((voice) => ({
							name: `${voice.name}（${voice.style}）`,
							value: voice.id,
						})),
					),
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
					.setName("type")
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
				case "speed":
					await handleSpeedSettings(interaction, serverId, userId);
					break;
				case "show":
					await showSettings(interaction, serverId, userId);
					break;
				case "toggle":
					await toggleReadingEnabled(interaction, serverId, userId);
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
			error(`設定コマンドの実行中にエラーが発生したのだ: ${err}`);
			await interaction.reply({
				content: "設定の変更中にエラーが発生したのだ...",
				ephemeral: true,
			});
		}
	},
};

// 声のタイプ設定ハンドラー
async function handleVoiceSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
) {
	const voiceType = interaction.options.getInteger("type", true);

	// 存在する声のタイプか確認
	const voiceInfo = VOICES.find((v) => v.id === voiceType);
	if (!voiceInfo) {
		return await interaction.reply({
			content: "その声は使えないのだ...",
			ephemeral: true,
		});
	}

	// 設定を更新
	updateUserSettings(serverId, userId, { speakerId: voiceType });

	await interaction.reply({
		content: `声を ${voiceInfo.name}（${voiceInfo.style}）に変更したのだ！`,
		ephemeral: true,
	});
}

// 読み上げ速度設定ハンドラー
async function handleSpeedSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
) {
	const speedValue = interaction.options.getNumber("value", true);

	// 有効な速度か確認
	const speedInfo = SPEED_OPTIONS.find((s) => s.value === speedValue);
	if (!speedInfo) {
		return await interaction.reply({
			content: "その速度は使えないのだ...",
			ephemeral: true,
		});
	}

	// 設定を更新
	updateUserSettings(serverId, userId, { speedScale: speedValue });

	await interaction.reply({
		content: `読み上げ速度を「${speedInfo.label}」に変更したのだ！`,
		ephemeral: true,
	});
}

// 設定表示ハンドラー
async function showSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
) {
	const settings = getUserSettings(serverId, userId);
	const voice = VOICES.find((v) => v.id === settings.speakerId);
	const speed = SPEED_OPTIONS.find((s) => s.value === settings.speedScale) || { label: "カスタム" };

	const embed = new EmbedBuilder()
		.setTitle("🔧 ずんだもんの設定なのだ")
		.setDescription("現在の設定だよ")
		.setColor(0x7cfc00) // 薄緑色
		.addFields(
			{
				name: "👤 ユーザー",
				value: `<@${userId}>`,
				inline: true,
			},
			{
				name: "🔊 声のタイプ",
				value: voice ? `${voice.name}（${voice.style}）` : "不明",
				inline: true,
			},
			{
				name: "⏩ 読み上げ速度",
				value: speed.label,
				inline: true,
			},
			{
				name: "🟢 読み上げ状態",
				value: settings.enabled ? "有効" : "無効",
				inline: true,
			},
		);

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
}

// 読み上げ有効/無効切り替えハンドラー
async function toggleReadingEnabled(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
) {
	const currentSettings = getUserSettings(serverId, userId);
	const newEnabled = !currentSettings.enabled;

	// 設定を更新
	updateUserSettings(serverId, userId, { enabled: newEnabled });

	await interaction.reply({
		content: `読み上げを${newEnabled ? "有効" : "無効"}にしたのだ！`,
		ephemeral: true,
	});
}

// サーバーデフォルト設定ハンドラー
async function handleServerDefaultSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
) {
	// サーバーでない場合は設定不可
	if (serverId === "DM") {
		return await interaction.reply({
			content: "この設定はサーバーでのみ使用できるのだ！",
			ephemeral: true,
		});
	}

	// 管理者権限を確認
	if (
		!interaction.memberPermissions?.has("Administrator") &&
		interaction.user.id !== interaction.client.application?.owner?.id
	) {
		return await interaction.reply({
			content: "この設定は管理者のみが変更できるのだ！",
			ephemeral: true,
		});
	}

	const voiceType = interaction.options.getInteger("type", true);

	// 存在する声のタイプか確認
	const voiceInfo = VOICES.find((v) => v.id === voiceType);
	if (!voiceInfo) {
		return await interaction.reply({
			content: "その声は使えないのだ...",
			ephemeral: true,
		});
	}

	// サーバーのデフォルト設定を更新
	setServerDefaultSpeaker(serverId, voiceType);

	await interaction.reply({
		content: `サーバーのデフォルト声を ${voiceInfo.name}（${voiceInfo.style}）に変更したのだ！`,
		ephemeral: true,
	});
}
