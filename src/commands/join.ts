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
import { enableTextToSpeech } from "../models/activeChannels";
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

export const join = {
	data: new SlashCommandBuilder()
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

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

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
	},
};
