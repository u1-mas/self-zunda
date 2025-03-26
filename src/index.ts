import * as fs from "node:fs";
import * as path from "node:path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import type { Command } from "./commands/types";
import { initializeClient } from "./core/client";
import { handleInteraction } from "./handlers/interactionHandler";
import { handleMessageCreate } from "./handlers/messageHandler";
import { handleVoiceStateUpdate } from "./handlers/voiceStateHandler";
import { error, info, log } from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

// メイン関数
export const main = async () => {
	// 環境変数の読み込み
	config();

	// 起動時のログメッセージを表示
	info("Bot起動中なのだ...");

	// クライアントの初期化
	const client = await initializeClient();

	// クライアントの登録済みコマンドを取得
	if (!client.application) {
		error(
			"アプリケーションが初期化されていません。Discord APIに接続できていない可能性があります。",
		);
		process.exit(1);
	}

	// VOICEVOXサーバーの疎通確認
	try {
		await checkVoicevoxServerHealth();
		info("VOICEVOXサーバーに接続しました。");
	} catch (err) {
		error(`VOICEVOXサーバーに接続できませんでした: ${err}`);
		process.exit(1);
	}

	// イベントリスナーの登録
	client.on(Events.InteractionCreate, handleInteraction);

	// メッセージハンドラの登録
	client.on(Events.MessageCreate, handleMessageCreate);

	// ボイスステータスハンドラの登録
	client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

	// ログイン処理
	client.login(process.env.DISCORD_TOKEN).catch((err) => {
		error(`ログインに失敗しました: ${err}`);
		process.exit(1);
	});
};

// モジュールを直接実行した場合にmain関数を実行する
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((err) => {
		error(`エラーが発生しました: ${err}`);
		process.exit(1);
	});
}

// HMR (Hot Module Replacement) 対応
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		log("HMR: モジュールを破棄します");
	});
}
