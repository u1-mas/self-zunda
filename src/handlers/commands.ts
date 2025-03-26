import { Collection } from "discord.js";
import { join } from "../commands/join.ts";
import { leave } from "../commands/leave.ts";
import { ping } from "../commands/ping.ts";
import { settings } from "../commands/settings.ts";
import { status } from "../commands/status.ts";
import type { Command } from "../commands/types.ts";

// コマンドのコレクションを作成
export const commands = new Collection<string, Command>();

// コマンドを登録
commands.set(ping.data.name, ping);
commands.set(settings.data.name, settings);
commands.set(join.data.name, join);
commands.set(leave.data.name, leave);
commands.set(status.data.name, status);

// コマンドデータを配列に変換（Discord APIに登録するため）
export const commandsData = Array.from(commands.values()).map((command) => command.data.toJSON());
