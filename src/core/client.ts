import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleMessage } from "../features/textToSpeech";
import { handleInteraction } from "../handlers/interactionHandler";
import { handleVoiceStateUpdate } from "../handlers/voiceStateHandler";
import { error, log } from "../utils/logger";
import { checkVoicevoxServerHealth } from "../utils/voicevox";

let hasCheckedVoicevox = false;
let client: Client | null = null;

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

        client.once(Events.ClientReady, () => {
            log("ずんだもんが起動したのだ！");
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

export function getClient() {
    return client;
}
