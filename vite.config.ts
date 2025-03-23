/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

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
	// HMRの設定
	server: {
		hmr: {
			overlay: true,
		},
	},
	test: {
		globals: true,
		environment: "node",
	},
});
