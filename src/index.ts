import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import { log } from "./utils/logger";

config();

// HMR機能を実装するのだ！
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        log("モジュールの更新を検知したのだ！");
        void initializeClient();
    });

    import.meta.hot.dispose(() => {
        log("モジュールを破棄するのだ！");
    });

    process.once("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
    });

    process.once("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
    });
} else {
    void initializeClient();

    process.once("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
    });

    process.once("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
    });
}
