import {
	VoiceConnectionStatus,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
} from "@discordjs/voice";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import {
	disableTextToSpeech,
	enableTextToSpeech,
} from "../features/textToSpeech";
import { error } from "../utils/logger";
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
		.setDescription("ボイスチャンネルに参加して読み上げを開始するのだ"),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

		const member = interaction.guild.members.cache.get(interaction.user.id);
		if (!member) {
			await interaction.reply({
				content: "メンバー情報が取得できなかったのだ...",
				ephemeral: true,
			});
			return;
		}

		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			await interaction.reply({
				content: "先にボイスチャンネルに参加してほしいのだ！",
				ephemeral: true,
			});
			return;
		}

		try {
			// VoiceVoxの疎通確認
			await checkVoicevox();

			const connection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
			// 読み上げを有効化
			if (!interaction.channel?.id) {
				throw new Error("チャンネルIDが取得できませんでした");
			}
			enableTextToSpeech(interaction.guild.id, interaction.channel.id);

			await interaction.reply({
				content: `${voiceChannel.name}に参加して、このチャンネルの読み上げを開始したのだ！`,
				ephemeral: true,
			});
		} catch (err) {
			error(
				"ボイスチャンネルへの参加に失敗したのだ:",
				err instanceof Error ? err.message : "予期せぬエラーが発生したのだ...",
			);
			await interaction.reply({
				content:
					err instanceof Error
						? `ボイスチャンネルへの参加に失敗したのだ: ${err.message}`
						: "ボイスチャンネルへの参加に失敗したのだ...",
				ephemeral: true,
			});
		}
	},
};

export const leave = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("ボイスチャンネルから離れて読み上げを停止するのだ"),
	async execute(interaction: CommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
			return;
		}

		const connection = getVoiceConnection(interaction.guild.id);
		if (!connection) {
			await interaction.reply({
				content: "ぼくはボイスチャンネルにいないのだ！",
				ephemeral: true,
			});
			return;
		}

		try {
			// 読み上げを無効化
			disableTextToSpeech(interaction.guild.id);

			connection.destroy();
			await interaction.reply({
				content: "ボイスチャンネルから離れて、読み上げを停止したのだ！",
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "ボイスチャンネルからの退出に失敗したのだ...",
				ephemeral: true,
			});
		}
	},
};
