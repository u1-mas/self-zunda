import { load } from "./deps.ts";
import { bot } from "./src/bot.ts";

// 環境変数の読み込み
await load({ export: true });

try {
  console.log("Starting bot...");
  await bot.start();
  console.log("Bot is ready!");
} catch (error) {
  console.error("Error starting bot:", error);
  Deno.exit(1);
}

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
