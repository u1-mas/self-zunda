import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { commands } from "./handlers/commands";
import { handleMessage } from "./features/textToSpeech";
import { getVoiceConnection } from "@discordjs/voice";

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
