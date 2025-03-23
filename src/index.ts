import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import * as logger from "./utils/logger";
import { checkVoicevoxServerHealth } from "./utils/voicevox";

config();
await checkVoicevoxServerHealth();
await initializeClient();

process.on("SIGINT", () => {
    logger.log("SIGINT 信号を受け取ったのだ！");
    handleShutdown();
});

process.on("SIGTERM", () => {
    logger.log("SIGTERM 信号を受け取ったのだ！");
    handleShutdown();
});

process.on("uncaughtException", (error) => {
    logger.log("予期せぬエラーが発生したのだ！");
    logger.error(
        error instanceof Error
            ? error.message
            : "予期せぬエラーが発生したのだ！",
    );
});

process.on("unhandledRejection", (reason, promise) => {
    logger.log("未処理のPromiseが発生したのだ！");
    logger.error(
        reason instanceof Error
            ? reason.message
            : "予期せぬエラーが発生したのだ！",
        promise,
    );
});
