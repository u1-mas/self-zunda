import { Collection } from "discord.js";
import type { Command } from "../commands/types";
import { ping } from "../commands/ping";

// コマンドのコレクションを作成
export const commands = new Collection<string, Command>();

// コマンドを登録
commands.set(ping.data.name, ping);

// コマンドのJSONデータを取得（スラッシュコマンドの登録に使用）
export const commandsData = Array.from(commands.values()).map((command) =>
    command.data.toJSON()
);
