import { load } from "@std/dotenv";

// 環境変数の読み込み
const env = await load();
Object.entries(env).forEach(([key, value]) => {
  Deno.env.set(key, value);
});

import { bot } from "./src/bot.ts";

try {
  console.log("Starting bot...");
  await bot.start();
  console.log("Bot is ready!");
} catch (error) {
  console.error("Error starting bot:", error);
  Deno.exit(1);
}
