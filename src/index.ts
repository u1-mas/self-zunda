import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { error, info, log } from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

config();

await checkVoicevoxServerHealth();

// 起動時のログメッセージを表示
info("Bot起動中なのだ...");
// クライアントの初期化
const client = await initializeClient();

// クライアントの登録済みコマンドを取得
if (!client.application) {
	error("アプリケーションが初期化されていません。Discord APIに接続できていない可能性があります。");
	process.exit(1);
}

// HMR (Hot Module Replacement) 対応
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		log("HMR: モジュールを破棄します");
	});
}
