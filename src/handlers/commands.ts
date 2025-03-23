import { Collection } from "discord.js";
import { ping } from "../commands/ping";
import { settings } from "../commands/settings";
import type { Command } from "../commands/types";
import { voice } from "../commands/voice";

// コマンドのコレクションを作成
export const commands = new Collection<string, Command>();

// コマンドを登録
commands.set(ping.data.name, ping);
commands.set(settings.data.name, settings);
commands.set(voice.data.name, voice);

// コマンドデータを配列に変換（Discord APIに登録するため）
export const commandsData = Array.from(commands.values()).map((command) => command.data.toJSON());
