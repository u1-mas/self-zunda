import { Collection } from "discord.js";
import { ping } from "../commands/ping";
import type { Command } from "../commands/types";
import { join, leave } from "../commands/voice";

// コマンドのコレクションを作成
export const commands = new Collection<string, Command>();

// コマンドを登録
commands.set(ping.data.name, ping);
commands.set(join.data.name, join);
commands.set(leave.data.name, leave);

// コマンドのJSONデータを取得（スラッシュコマンドの登録に使用）
export const commandsData = Array.from(commands.values()).map((command) => command.data.toJSON());
