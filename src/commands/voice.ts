import {
	VoiceConnectionStatus,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
} from "@discordjs/voice";
import {
	type ChatInputCommandInteraction,
	type GuildMember,
	SlashCommandBuilder,
	type VoiceChannel,
} from "discord.js";
import {
	disableTextToSpeech,
	enableTextToSpeech,
	getActiveChannels,
} from "../models/activeChannels";
import { error, log } from "../utils/logger";
import { checkVoicevoxServerHealth } from "../utils/voicevox";

// VoiceVoxの疎通確認フラグ
let hasCheckedVoicevox = false;

// VoiceVoxの疎通確認
async function checkVoicevox() {
	if (hasCheckedVoicevox) return;

	try {
		await checkVoicevoxServerHealth();
		hasCheckedVoicevox = true;
	} catch (err) {
		error(
			"VOICEVOXサーバーのチェックに失敗したのだ:",
			err instanceof Error ? err.message : "予期せぬエラーが発生したのだ...",
		);
		throw err;
	}
}

export const voice = {
	data: new SlashCommandBuilder()
		.setName("voice")
		.setDescription("ボイスチャンネル関連の操作を行うのだ")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("join")
				.setDescription("ボイスチャンネルに参加して読み上げを開始するのだ")
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription(
							"参加するボイスチャンネル（指定しない場合はあなたが参加しているチャンネル）",
						)
						.setRequired(false),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("leave").setDescription("ボイスチャンネルから退出するのだ"),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("status").setDescription("現在の読み上げ状態を確認するのだ"),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case "join":
				await handleJoinCommand(interaction);
				break;
			case "leave":
				await handleLeaveCommand(interaction);
				break;
			case "status":
				await handleStatusCommand(interaction);
				break;
			default:
				await interaction.reply({
					content: "サブコマンドが見つからないのだ...",
					ephemeral: true,
				});
		}
	},
};

async function handleJoinCommand(interaction: ChatInputCommandInteraction) {
	if (!interaction.guild) return;

	// チャンネルオプションをチェック
	let voiceChannel = interaction.options.getChannel("channel") as VoiceChannel | null;

	// チャンネルが指定されていない場合、ユーザーが参加しているチャンネルを使用
	if (!voiceChannel) {
		// インタラクションを実行したメンバーを取得
		const member = interaction.member as GuildMember;
		const memberVoiceChannel = member.voice.channel;

		if (!memberVoiceChannel) {
			await interaction.reply({
				content:
					"ボイスチャンネルを指定するか、ボイスチャンネルに参加してからコマンドを実行するのだ！",
				ephemeral: true,
			});
			return;
		}

		voiceChannel = memberVoiceChannel as VoiceChannel;
	}

	// ボイスチャンネルに参加する
	try {
		// VoiceVoxの疎通確認
		await checkVoicevox();

		// 前のコネクションをクローズ
		const existingConnection = getVoiceConnection(interaction.guild.id);
		if (existingConnection) {
			existingConnection.destroy();
		}

		// 新しいコネクションを作成
		joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		// テキストチャンネルを有効化
		if (interaction.channel) {
			enableTextToSpeech(interaction.guild.id, interaction.channel.id);
		}

		log(
			`サーバー「${interaction.guild.name}」のボイスチャンネル「${voiceChannel.name}」に参加したのだ！`,
		);
		await interaction.reply({
			content: `<#${voiceChannel.id}> に参加して、このテキストチャンネルの内容を読み上げるのだ！`,
			ephemeral: true,
		});
	} catch (err) {
		error(`ボイスチャンネル参加エラー: ${err}`);
		await interaction.reply({
			content: "ボイスチャンネルへの参加に失敗したのだ…",
			ephemeral: true,
		});
	}
}

async function handleLeaveCommand(interaction: ChatInputCommandInteraction) {
	if (!interaction.guild) return;

	// コネクションを取得して切断
	const connection = getVoiceConnection(interaction.guild.id);

	if (connection) {
		connection.destroy();
		disableTextToSpeech(interaction.guild.id);
		log(`サーバー「${interaction.guild.name}」のボイスチャンネルから退出したのだ！`);
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
}

async function handleStatusCommand(interaction: ChatInputCommandInteraction) {
	if (!interaction.guild) return;

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
}
