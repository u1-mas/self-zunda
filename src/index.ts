import { config } from "dotenv";
import { initializeClient } from "./core/client";
import { handleShutdown } from "./handlers/shutdownHandler";
import { log } from "./utils/logger";

config();
initializeClient();

// HMR機能を実装するのだ！
if (import.meta.hot) {
    import.meta.hot.accept(async () => {
        log("モジュールの更新を検知したのだ！");
        await initializeClient();
    });

    import.meta.hot.dispose(() => {
        log("モジュールを破棄するのだ！");
    });

    process.once("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
        process.exit(0);
    });

    process.once("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
        process.exit(0);
    });
} else {
    process.once("SIGINT", () => {
        log("SIGINTを受信したのだ...");
        void handleShutdown();
        process.exit(0);
    });

    process.once("SIGTERM", () => {
        log("SIGTERMを受信したのだ...");
        void handleShutdown();
        process.exit(0);
    });
}
