import {
    CommandInteraction,
    SlashCommandBuilder,
    VoiceBasedChannel,
} from "discord.js";
import {
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import {
    disableTextToSpeech,
    enableTextToSpeech,
} from "../features/textToSpeech";

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
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

            // 読み上げを有効化
            enableTextToSpeech(interaction.guild.id, interaction.channel!.id);

            await interaction.reply({
                content:
                    `${voiceChannel.name}に参加して、このチャンネルの読み上げを開始したのだ！`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "ボイスチャンネルへの参加に失敗したのだ...",
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
