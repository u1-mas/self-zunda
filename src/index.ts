import { getVoiceConnection } from "@discordjs/voice";
import { Client, Events, GatewayIntentBits, type VoiceState } from "discord.js";
import { config } from "dotenv";
import { handleMessage } from "./features/textToSpeech";
import { commands } from "./handlers/commands";
import { playAudio } from "./utils/audio";
import { checkVoicevoxServerHealth, generateVoice } from "./utils/voicevox";

// リロード時の表示をカラフルにするのだ！
const colors = {
    green: "\x1b[32m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
};

// 現在の時刻を取得するのだ！
const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${
        now.getMinutes().toString().padStart(2, "0")
    }:${now.getSeconds().toString().padStart(2, "0")}`;
};

// リロード時のメッセージを表示するのだ！
console.log(
    `${colors.blue}[${getTimeString()}] ずんだもんが再起動したのだ！${colors.reset}`,
);

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once(Events.ClientReady, async () => {
    console.log(
        `${colors.green}[${getTimeString()}] ずんだもんが起動したのだ！${colors.reset}`,
    );

    try {
        // VOICEVOXサーバーの状態をチェック
        await checkVoicevoxServerHealth();
    } catch (error) {
        console.error(
            error instanceof Error
                ? error.message
                : "予期せぬエラーが発生したのだ...",
        );
        process.exit(1);
    }
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
process.on("SIGINT", async () => {
    console.log("SIGINTを受信したのだ...");
    await handleShutdown();
});
process.on("SIGTERM", async () => {
    console.log("SIGTERMを受信したのだ...");
    await handleShutdown();
});

async function handleShutdown() {
    console.log("シャットダウン処理を開始するのだ...");

    // 全てのギルドのボイスチャンネルから切断
    for (const guild of client.guilds.cache.values()) {
        const connection = getVoiceConnection(guild.id);
        if (connection) {
            console.log(`${guild.name} のボイスチャンネルから切断するのだ...`);
            try {
                // まずボイスコネクションを破棄
                connection.destroy();
                console.log(
                    `${guild.name} のボイスコネクションを破棄したのだ！`,
                );

                // その後、ボイスチャンネルから退出
                const me = guild.members.cache.get(client.user?.id || "");
                if (me?.voice.channel) {
                    console.log(
                        `${guild.name} の ${me.voice.channel.name} から退出するのだ...`,
                    );
                    me.voice.disconnect();
                    console.log(
                        `${guild.name} の ${me.voice.channel.name} から退出完了したのだ！`,
                    );
                }
            } catch (error) {
                console.error(
                    `${guild.name} のボイスチャンネルからの切断中にエラーが発生したのだ:`,
                    error,
                );
            }
        }
    }

    // クライアントを破棄してプロセスを終了
    await client.destroy();
    console.log("クライアントを破棄して、シャットダウンを完了するのだ！");
    process.exit(0);
}

client.login(process.env.DISCORD_TOKEN);
