import { defineConfig } from "vite";

export default defineConfig({
    // Node.jsのビルトインモジュールをバンドルから除外
    optimizeDeps: {
        exclude: ["@discordjs/voice"],
    },
    // ファイル変更時の自動再起動を有効化
    watch: {
        include: ["src/**"],
    },
});
