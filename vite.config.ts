import { resolve } from "node:path";
/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

export default defineConfig({
	// Node.jsのビルトインモジュールをバンドルから除外
	optimizeDeps: {
		exclude: ["@discordjs/voice"],
	},
	// HMRの設定
	server: {
		hmr: {
			overlay: true,
		},
	},
	// ビルド設定
	build: {
		// ライブラリモードで出力
		lib: {
			// エントリポイントを指定
			entry: resolve(__dirname, "src/index.ts"),
			// ESM形式で出力
			formats: ["es"],
			// ファイル名の指定
			fileName: "index",
		},
		// 出力先ディレクトリ
		outDir: "dist",
		// ソースマップを生成
		sourcemap: true,
		// rollupオプション
		rollupOptions: {
			// 外部モジュールとして扱うパッケージを指定
			external: ["discord.js", "@discordjs/voice", "axios", "dotenv", /node:.*/],
			// 出力設定
			output: {
				// ディレクトリ構造を維持
				preserveModules: true,
				// 出力先のディレクトリ
				preserveModulesRoot: "src",
				// エントリチャンクの名前
				entryFileNames: "[name].js",
			},
		},
		// minifyを無効化
		minify: false,
		// Top-level awaitをサポートするためのターゲット設定
		target: "esnext",
	},
	test: {
		globals: true,
		environment: "node",
	},
});
