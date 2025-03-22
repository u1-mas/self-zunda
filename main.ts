import { bot } from "./src/bot.ts";

try {
  console.log("Starting bot...");
  await bot.start();
  console.log("Bot is ready!");
} catch (error) {
  console.error("Error starting bot:", error);
  Deno.exit(1);
}
