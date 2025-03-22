import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { commands } from "./handlers/commands";
import { handleMessage } from "./features/textToSpeech";

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

client.login(process.env.DISCORD_TOKEN);
