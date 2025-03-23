import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import { log } from "./utils/logger";

config();

// HMR機能を実装するのだ！
if (import.meta.hot) {
    import.meta.hot.accept(async () => {
        log("モジュールの更新を検知したのだ！");
        await initializeClient();
    });

    import.meta.hot.dispose(() => {
        log("モジュールを破棄するのだ！");
    });

    process.on("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
    });

    process.on("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
    });
} else {
    void initializeClient();

    process.on("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
    });

    process.on("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
    });
}
