import * as fs from "node:fs";
import * as path from "node:path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import type { Command } from "./commands/types";
import { initializeClient } from "./core/client";
import { handleMessageCreate } from "./handlers/messageHandler";
import { handleVoiceStateUpdate } from "./handlers/voiceStateHandler";
import { error, info } from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

// メイン関数
const main = async () => {
	// 環境変数の読み込み
	config();

	// 起動時のログメッセージを表示
	info("Bot起動中なのだ...");

	// VOICEVOXへの接続テスト
	const voicevoxConnected = await checkVoicevoxServerHealth();
	if (!voicevoxConnected) {
		throw new Error("VOICEVOXへの接続に失敗したのだ！");
	}

	// クライアントの作成と初期化
	const client = await initializeClient();

	// コマンドの読み込み
	const commandsPath = path.join(path.dirname(new URL(import.meta.url).pathname), "commands");
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	// コマンドコレクションの作成
	client.commands = new Collection<string, Command>();

	// コマンドの登録
	for (const file of commandFiles) {
		if (file === "types.ts" || file === "voice.ts" || file.endsWith(".test.ts")) continue;

		const filePath = path.join(commandsPath, file);
		const commandModule = await import(filePath);
		const command = commandModule.default || commandModule;

		// commandの各キーをチェック
		const commandKeys = Object.keys(command);
		for (const key of commandKeys) {
			const cmd = command[key];
			// データとexecuteメソッドを持つオブジェクトのみを登録
			if (cmd.data && cmd.execute) {
				const commandName = cmd.data.name;
				client.commands.set(commandName, cmd);
				info(`コマンド「${commandName}」を登録したのだ！`);
			}
		}
	}

	// メッセージハンドラの登録
	// client.on(Events.MessageCreate, handleMessageCreate);

	// ボイスステータスハンドラの登録
	// client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

	// ログイン処理
	const token = process.env.DISCORD_TOKEN;

	if (!token) {
		error("DISCORD_TOKENがセットされていないのだ！");
		process.exit(1);
	}

	client.login(token).catch((err: Error) => {
		error("ログインに失敗したのだ：", err);
		process.exit(1);
	});
};

// メイン関数の実行
main().catch((err) => {
	error("エラーが発生したのだ：", err);
	process.exit(1);
});
