import { Bot, createBot, GatewayIntents } from "discordeno";

// 環境変数からトークンを取得
const token = Deno.env.get("DISCORD_TOKEN");
if (!token) {
  throw new Error("Discord token not found in environment variables");
}

// ボットの作成
export const bot: Bot = createBot({
  token,
  intents: GatewayIntents.Guilds |
    GatewayIntents.GuildVoiceStates |
    GatewayIntents.GuildMessages |
    GatewayIntents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`Logged in as ${payload.user.username}!`);
    },
  },
});
