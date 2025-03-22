import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateVoice, testVoicevox } from "../utils/voicevox";

async function main() {
	// まず接続テストを実行
	const testResult = await testVoicevox();
	console.log(testResult.message);

	if (!testResult.success) {
		process.exit(1);
	}

	// テキストを指定して音声生成のテスト
	const text = process.argv[2] || "これはテストなのだ！速さはどうかな？";
	console.log(`テキスト「${text}」で音声を生成するのだ...`);

	try {
		const audioBuffer = await generateVoice(text);

		// 生成した音声を保存
		const outputPath = join(process.cwd(), "test-output.wav");
		await writeFile(outputPath, audioBuffer);
		console.log(`音声ファイルを保存したのだ: ${outputPath}`);
	} catch (error) {
		console.error("音声生成に失敗したのだ:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("エラーが発生したのだ:", error);
	process.exit(1);
});
