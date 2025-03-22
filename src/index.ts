import { getVoiceConnection } from "@discordjs/voice";
import { Client, Events, GatewayIntentBits, type VoiceState } from "discord.js";
import { config } from "dotenv";
import { handleMessage } from "./features/textToSpeech";
import { commands } from "./handlers/commands";
import { playAudio } from "./utils/audio";
import { generateVoice } from "./utils/voicevox";

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once(Events.ClientReady, () => {
    console.log(`${client.user?.tag} としてログインしたのだ！`);
});

// ボイスチャンネルの状態変更を監視
client.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
        // ボットの状態変更は無視
        if (newState.member?.user.bot) return;

        // チャンネルが変更された場合
        if (oldState.channelId !== newState.channelId) {
            const connection = getVoiceConnection(newState.guild.id);
            if (!connection) return;

            try {
                const memberName = newState.member?.displayName ||
                    "不明なユーザー";

                // 新しいチャンネルに参加した場合
                if (newState.channelId) {
                    const text = `${memberName}が参加したのだ！`;
                    const audioBuffer = await generateVoice(text);
                    await playAudio(connection, audioBuffer);
                } // チャンネルから抜けた場合
                else if (oldState.channelId) {
                    const text = `${memberName}が抜けたのだ！`;
                    const audioBuffer = await generateVoice(text);
                    await playAudio(connection, audioBuffer);
                }
            } catch (error) {
                console.error(
                    "ボイスチャンネルの状態変更の読み上げに失敗したのだ:",
                    error,
                );
            }
        }
    },
);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "コマンドの実行中にエラーが発生したのだ...",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "コマンドの実行中にエラーが発生したのだ...",
                ephemeral: true,
            });
        }
    }
});

// メッセージイベントのハンドラーを追加
client.on(Events.MessageCreate, handleMessage);

// プロセス終了時の処理
process.on("SIGINT", () => handleShutdown());
process.on("SIGTERM", () => handleShutdown());

function handleShutdown() {
    console.log("シャットダウン処理を開始するのだ...");

    // 全てのギルドのボイスチャンネルから切断
    for (const guild of client.guilds.cache.values()) {
        const connection = getVoiceConnection(guild.id);
        if (connection) {
            console.log(`${guild.name} のボイスチャンネルから切断するのだ...`);
            connection.destroy();
        }
    }

    // クライアントを破棄してプロセスを終了
    client.destroy();
    process.exit(0);
}

client.login(process.env.DISCORD_TOKEN);
