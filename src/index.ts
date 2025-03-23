import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import * as logger from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

config();

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
	process.on("SIGINT", signalHandler);
	process.on("SIGTERM", signalHandler);
	process.on("uncaughtException", errorHandler);
	process.on("unhandledRejection", rejectionHandler);
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
	if (import.meta.hot) {
		// HMRの場合
		if (import.meta.hot.data.checkedVoicevox === undefined) {
			import.meta.hot.data.checkedVoicevox = false;
		}
		if (!import.meta.hot.data.checkedVoicevox) {
			import.meta.hot.data.checkedVoicevox = await checkVoicevoxServerHealth();
		}
	} else {
		// 通常起動の場合
		await checkVoicevoxServerHealth();
	}

	await initializeClient();
	setupEventListeners();
}

if (import.meta.hot) {
	import.meta.hot.dispose(async () => {
		logger.log("古いクライアントをクリーンアップするのだ！");
		await handleShutdown();
		removeEventListeners();
	});

	import.meta.hot.accept(async () => {
		logger.log("HMRが発生したのだ！新しいクライアントを初期化するのだ！");
		await initialize();
	});
}

// エントリーポイント
await initialize();
