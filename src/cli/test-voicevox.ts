import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkVoicevoxServerHealth, generateVoice } from "../utils/voicevox";

async function main() {
	try {
		// まず接続テストを実行
		await checkVoicevoxServerHealth();

		// テキストを指定して音声生成のテスト
		const text = process.argv[2] || "これはテストなのだ！速さはどうかな？";

		const audioBuffer = await generateVoice(text);

		// 生成した音声を保存
		const outputPath = join(process.cwd(), "test-output.wav");
		await writeFile(outputPath, Buffer.from(audioBuffer));
	} catch (error) {
		console.error(error instanceof Error ? error.message : "予期せぬエラーが発生したのだ...");
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("エラーが発生したのだ:", error);
	process.exit(1);
});
