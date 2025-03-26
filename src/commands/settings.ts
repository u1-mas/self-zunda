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
// ID: VOICEVOXでのスピーカーID
// NAME: 日本語での表示名
// STYLE: スタイルの説明
export const VOICES = [
	// 四国めたん
	{ id: 2, name: "四国めたん", style: "ノーマル" },
	{ id: 0, name: "四国めたん", style: "あまあま" },
	{ id: 6, name: "四国めたん", style: "ツンツン" },
	{ id: 4, name: "四国めたん", style: "セクシー" },
	{ id: 36, name: "四国めたん", style: "ささやき" },
	{ id: 37, name: "四国めたん", style: "ヒソヒソ" },

	// ずんだもん
	{ id: 3, name: "ずんだもん", style: "ノーマル" },
	{ id: 1, name: "ずんだもん", style: "あまあま" },
	{ id: 7, name: "ずんだもん", style: "ツンツン" },
	{ id: 5, name: "ずんだもん", style: "セクシー" },
	{ id: 22, name: "ずんだもん", style: "ささやき" },
	{ id: 38, name: "ずんだもん", style: "ヒソヒソ" },
	{ id: 39, name: "ずんだもん", style: "ヘロヘロ" },
	{ id: 50, name: "ずんだもん", style: "なみだめ" },

	// その他の話者
	{ id: 8, name: "春日部つむぎ", style: "ノーマル" },
	{ id: 9, name: "雨晴はう", style: "ノーマル" },
	{ id: 10, name: "波音リツ", style: "ノーマル" },
	{ id: 11, name: "波音リツ", style: "クイーン" },
];

// 読み上げ速度のオプション一覧
const SPEED_OPTIONS = [
	{ value: 0.75, label: "遅い", description: "遅めの読み上げ速度" },
	{ value: 1.0, label: "普通", description: "標準的な読み上げ速度" },
	{ value: 1.25, label: "速い", description: "速めの読み上げ速度" },
	{ value: 1.5, label: "かなり速い", description: "かなり速い読み上げ速度" },
];

// 話者一覧（名前だけの一意なリスト）
// Discord制限（25選択肢）に合わせて、一部の主要キャラクターのみを表示
const SPEAKERS = [
	{ name: "ずんだもん" },
	{ name: "四国めたん" },
	{ name: "春日部つむぎ" },
	{ name: "雨晴はう" },
	{ name: "波音リツ" },
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
						...SPEAKERS.map((speaker) => ({
							name: speaker.name,
							value: speaker.name,
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
	const voiceType = interaction.options.getInteger("speaker", true);

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

// スタイル設定ハンドラー
async function handleStyleSettings(
	interaction: ChatInputCommandInteraction,
	serverId: string,
	userId: string,
) {
	const speakerName = interaction.options.getString("speaker", true);
	const requestedStyle = interaction.options.getString("style", true);

	// 話者の声のスタイル一覧を取得
	const speakerVoices = VOICES.filter((v) => v.name === speakerName);

	if (speakerVoices.length === 0) {
		return await interaction.reply({
			content: "その話者は存在しないのだ...",
			ephemeral: true,
		});
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

	const voiceType = interaction.options.getInteger("speaker", true);

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
