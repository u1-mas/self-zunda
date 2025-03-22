import { readTextBot } from "./src/bot.ts";

try {
  console.log("Starting bot...");
  await readTextBot.start();
  console.log("Bot is ready!");
} catch (error) {
  console.error("Error starting bot:", error);
  Deno.exit(1);
}
