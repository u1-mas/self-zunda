import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("ready", () => {
    console.log(
        `ぼくは準備ができたのだ！ ${client.user?.tag} としてログインしたのだ！`,
    );
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "ping") {
        await message.reply("ぽんなのだ！");
    }
});

client.login(process.env.DISCORD_TOKEN);
