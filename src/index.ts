import { getVoiceConnection } from "@discordjs/voice";
import {
    Client,
    Events,
    GatewayIntentBits,
    type Interaction,
    type VoiceState,
} from "discord.js";
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
        now
            .getMinutes()
            .toString()
            .padStart(2, "0")
    }:${now.getSeconds().toString().padStart(2, "0")}`;
};

config();

// シャットダウン中かどうかを管理するのだ！
let isShuttingDown = false;
let client: Client | null = null;

// VOICEVOXのチェックは最初の起動時だけ行うのだ！
let hasCheckedVoicevox = false;

async function checkVoicevoxServer() {
    if (hasCheckedVoicevox) return;

    try {
        console.log("VOICEVOXサーバーの状態をチェックするのだ！");
        await checkVoicevoxServerHealth();
        hasCheckedVoicevox = true;
    } catch (error) {
        console.error(
            error instanceof Error
                ? error.message
                : "予期せぬエラーが発生したのだ...",
        );
        process.exit(1);
    }
}

async function initializeClient() {
    // シャットダウン中は初期化しないのだ！
    if (isShuttingDown) return;

    try {
        // 既存のクライアントがあれば破棄するのだ！
        if (client) {
            await client.destroy();
            client = null;
            console.log(
                `${colors.blue}[${getTimeString()}] ずんだもんが再起動したのだ！${colors.reset}`,
            );
        }

        client = new Client({
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
            console.log(
                `${colors.green}[${getTimeString()}] ホットリロードのテスト2なのだ！${colors.reset}`,
            );

            // VOICEVOXのチェックは最初の起動時だけ行うのだ！
            await checkVoicevoxServer();
        });

        // イベントハンドラーを設定するのだ！
        client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);
        client.on(Events.InteractionCreate, handleInteraction);
        client.on(Events.MessageCreate, handleMessage);

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error("クライアントの初期化に失敗したのだ:", error);
        process.exit(1);
    }
}

// イベントハンドラーを定義するのだ！
async function handleVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState,
) {
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
}

async function handleInteraction(interaction: Interaction) {
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
}

// プロセス終了時の処理なのだ！
async function handleShutdown() {
    if (isShuttingDown || !client) return;
    isShuttingDown = true;
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
            } catch (error) {
                console.error(
                    `${guild.name} のボイスコネクションの破棄中にエラーが発生したのだ:`,
                    error,
                );
            }
        }
    }

    // クライアントを破棄してプロセスを終了
    try {
        await client.destroy();
        client = null;
        console.log("クライアントを破棄して、シャットダウンを完了するのだ！");
    } catch (error) {
        console.error("クライアントの破棄中にエラーが発生したのだ:", error);
    } finally {
        process.exit(0);
    }
}

// シグナルハンドラーは一度だけ登録するのだ！
let hasRegisteredSignalHandlers = false;

function registerSignalHandlers() {
    if (hasRegisteredSignalHandlers) return;

    process.once("SIGINT", async () => {
        console.log("SIGINTを受信したのだ...");
        await handleShutdown();
    });

    process.once("SIGTERM", async () => {
        console.log("SIGTERMを受信したのだ...");
        await handleShutdown();
    });

    hasRegisteredSignalHandlers = true;
}

// シグナルハンドラーを登録するのだ！
registerSignalHandlers();

// HMR機能を実装するのだ！
if (import.meta.hot) {
    // 初回のHMR起動時
    initializeClient();

    // モジュールの更新を検知したときの処理なのだ！
    import.meta.hot.accept(() => {
        console.log(
            `${colors.blue}[${getTimeString()}] モジュールの更新を検知したのだ！${colors.reset}`,
        );
        initializeClient();
    });
} else {
    // 通常の起動時
    initializeClient();
}
