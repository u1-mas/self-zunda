import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import type { Guild } from "discord.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleMessage } from "../features/textToSpeech";
import { handleInteraction } from "../handlers/interactionHandler";
import { handleVoiceStateUpdate } from "../handlers/voiceStateHandler";
import { error, log } from "../utils/logger";
import { checkVoicevoxServerHealth } from "../utils/voicevox";

let hasCheckedVoicevox = false;
let client: Client | null = null;

// 前回のボイスチャンネル状態を保持
interface VoiceState {
    guildId: string;
    channelId: string;
    adapterCreator: Guild["voiceAdapterCreator"];
}
let previousVoiceStates: VoiceState[] = [];

// ボイスチャンネルの状態を保存
function saveVoiceStates() {
    if (!client) return;

    previousVoiceStates = [];
    for (const guild of client.guilds.cache.values()) {
        const connection = getVoiceConnection(guild.id);
        if (connection?.joinConfig.channelId) {
            previousVoiceStates.push({
                guildId: guild.id,
                channelId: connection.joinConfig.channelId,
                adapterCreator: guild.voiceAdapterCreator,
            });
        }
    }
    log(`${previousVoiceStates.length}個のボイスチャンネル状態を保存したのだ！`);
}

// 保存したボイスチャンネルに再接続
async function reconnectToVoiceChannels() {
    if (previousVoiceStates.length === 0) return;

    log(`${previousVoiceStates.length}個のボイスチャンネルに再接続するのだ！`);
    for (const state of previousVoiceStates) {
        try {
            joinVoiceChannel({
                channelId: state.channelId,
                guildId: state.guildId,
                adapterCreator: state.adapterCreator,
            });
            log(`${state.guildId}のボイスチャンネルに再接続したのだ！`);
        } catch (err) {
            error(
                `${state.guildId}のボイスチャンネルへの再接続に失敗したのだ:`,
                err,
            );
        }
    }
}

async function checkVoicevoxServer() {
    if (hasCheckedVoicevox) {
        log("VOICEVOXは既にチェック済みなのだ！");
        return;
    }

    try {
        log("VOICEVOXサーバーの状態をチェックするのだ！");
        await checkVoicevoxServerHealth();
        hasCheckedVoicevox = true;
    } catch (err) {
        error(
            "VOICEVOXサーバーのチェックに失敗したのだ:",
            err instanceof Error
                ? err.message
                : "予期せぬエラーが発生したのだ...",
        );
        process.exit(1);
    }
}

export async function initializeClient() {
    try {
        if (client) {
            // クライアントを破棄する前にボイスチャンネルの状態を保存
            saveVoiceStates();
            await client.destroy();
            client = null;
            log("ずんだもんが再起動したのだ！");
        }

        await checkVoicevoxServer();

        client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ],
        });

        client.once(Events.ClientReady, async () => {
            log("ずんだもんが起動したのだ！");
            // クライアントの準備ができたら保存したボイスチャンネルに再接続
            await reconnectToVoiceChannels();
        });

        client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);
        client.on(Events.InteractionCreate, handleInteraction);
        client.on(Events.MessageCreate, handleMessage);

        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        error("クライアントの初期化に失敗したのだ:", err);
        process.exit(1);
    }
}

export function getClient(): Client | null {
    return client;
}
