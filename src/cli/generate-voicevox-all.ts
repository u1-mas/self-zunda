/**
 * VOICEVOXのOpenAPI定義とAPIクライアントを生成するスクリプト
 */
import { spawn } from "node:child_process";
import * as path from "node:path";

/**
 * 子プロセスを実行し、結果をPromiseで返す
 */
function execCommand(command: string, args: string[]): Promise<void> {
	return new Promise((resolve, reject) => {
		console.log(`実行: ${command} ${args.join(" ")}`);

		const childProcess = spawn(command, args, {
			stdio: "inherit",
			shell: true,
		});

		childProcess.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`コマンドが失敗しました: ${command} ${args.join(" ")} (code: ${code})`));
			}
		});

		childProcess.on("error", (err) => {
			reject(err);
		});
	});
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
	try {
		// 1. APIクライアント生成スクリプトを実行
		const scriptPath = path.resolve(process.cwd(), "src/cli/generate-voicevox-api.ts");
		await execCommand("tsx", [scriptPath]);

		console.log("VOICEVOXのAPI生成が完了しました！");
	} catch (error) {
		console.error("エラーが発生しました:", error);
		process.exit(1);
	}
}

// スクリプト実行
main().catch(console.error);
