import {
  createBot,
  createDesiredPropertiesObject,
  DesiredPropertiesBehavior,
  Intents,
} from "discordeno";

// 環境変数からトークンを取得
const token = Deno.env.get("DISCORD_TOKEN");
if (!token) {
  throw new Error("Discord token not found in environment variables");
}

// ボットの作成
const desiredProperties = createDesiredPropertiesObject({});
export interface BotDesiredProperties
  extends Required<typeof desiredProperties> {}
export const readTextBot = createBot({
  token,
  intents: Intents.Guilds | Intents.GuildVoiceStates | Intents.GuildMessages |
    Intents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`Logged in as ${payload.user.username}!`);
    },
  },
  desiredProperties,
  desiredPropertiesBehavior: DesiredPropertiesBehavior.ChangeType,
});
export type ReadTextBot = typeof readTextBot;
