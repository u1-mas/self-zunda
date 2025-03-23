import { defineConfig } from "vite";

export default defineConfig({
    // Node.jsのビルトインモジュールをバンドルから除外
    optimizeDeps: {
        exclude: ["@discordjs/voice"],
    },
    // vite-nodeの設定
    define: {
        // プロセス環境変数を有効化
        "process.env": {
            ...process.env,
            VITE_HMR: "true",
        },
    },
});
