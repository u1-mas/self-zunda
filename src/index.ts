import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import * as logger from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

// 環境変数を最初に読み込む
config();
logger.debug("環境変数を読み込んだのだ！", logger.colors.green);

// シグナルハンドラーを定義
const signalHandler = async () => {
	logger.log("SIGINT/SIGTERM 信号を受け取ったのだ！");
	await handleShutdown();
	process.exit(0);
};

const errorHandler = (error: unknown) => {
	logger.log("予期せぬエラーが発生したのだ！");
	logger.error(error instanceof Error ? error.message : "予期せぬエラーが発生したのだ！");
	process.exit(1);
};

const rejectionHandler = (reason: unknown, promise: Promise<unknown>) => {
	logger.log("未処理のPromiseが発生したのだ！");
	logger.error(
		reason instanceof Error ? reason.message : "予期せぬエラーが発生したのだ！",
		promise,
	);
	process.exit(1);
};

// イベントリスナーを設定
const setupEventListeners = () => {
	// 既存のリスナーを削除してから新しいリスナーを設定
	removeEventListeners();
	logger.debug("プロセスのイベントリスナーを設定するのだ！", logger.colors.blue);
	process.on("SIGINT", signalHandler);
	process.on("SIGTERM", signalHandler);
	process.on("uncaughtException", errorHandler);
	process.on("unhandledRejection", rejectionHandler);
	logger.debug("プロセスのイベントリスナーを設定完了したのだ！", logger.colors.green);
};

// イベントリスナーを削除
const removeEventListeners = () => {
	process.removeAllListeners("SIGINT");
	process.removeAllListeners("SIGTERM");
	process.removeAllListeners("uncaughtException");
	process.removeAllListeners("unhandledRejection");
};

// 初期化処理
async function initialize() {
	logger.log("ボットの初期化処理を開始するのだ！", logger.colors.blue);

	if (import.meta.hot) {
		// HMRの場合
		logger.debug("HMRモードでの初期化なのだ", logger.colors.blue);
		if (import.meta.hot.data.checkedVoicevox === undefined) {
			import.meta.hot.data.checkedVoicevox = false;
		}
		if (!import.meta.hot.data.checkedVoicevox) {
			logger.debug("VOICEVOXサーバーのヘルスチェックを実行するのだ", logger.colors.blue);
			try {
				import.meta.hot.data.checkedVoicevox = await checkVoicevoxServerHealth();
				logger.log("VOICEVOXサーバーのヘルスチェック成功なのだ！", logger.colors.green);
			} catch (err) {
				logger.log("VOICEVOXサーバーのヘルスチェックに失敗したのだ...", logger.colors.reset);
				throw err;
			}
		}
	} else {
		// 通常起動の場合
		logger.debug("通常モードでの初期化なのだ", logger.colors.blue);
		logger.debug("VOICEVOXサーバーのヘルスチェックを実行するのだ", logger.colors.blue);
		try {
			await checkVoicevoxServerHealth();
			logger.log("VOICEVOXサーバーのヘルスチェック成功なのだ！", logger.colors.green);
		} catch (err) {
			logger.log("VOICEVOXサーバーのヘルスチェックに失敗したのだ...", logger.colors.reset);
			throw err;
		}
	}

	logger.debug("クライアントの初期化を開始するのだ", logger.colors.blue);
	try {
		await initializeClient();
		logger.log("クライアントの初期化に成功したのだ！", logger.colors.green);
	} catch (err) {
		logger.log("クライアントの初期化に失敗したのだ...", logger.colors.reset);
		throw err;
	}

	setupEventListeners();
	logger.debug("初期化処理が完了したのだ！", logger.colors.green);
}

if (import.meta.hot) {
	import.meta.hot.dispose(async () => {
		logger.debug("古いクライアントをクリーンアップするのだ！");
		await handleShutdown();
		removeEventListeners();
	});

	import.meta.hot.accept(async () => {
		logger.debug("HMRが発生したのだ！新しいクライアントを初期化するのだ！");
		await initialize();
	});
}

// エントリーポイント
logger.log("ボットが起動するのだ！", logger.colors.blue);
await initialize();
logger.log("ボットの起動が完了したのだ！", logger.colors.green);
