import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkVoicevoxServerHealth, generateVoice } from "../utils/voicevox.ts";
import { logger } from "../utils/logger.ts";
import { SPEAKERS } from "../commands/settings/constants/voices.ts";

async function main() {
	logger.log(JSON.stringify(SPEAKERS, null, 2));
	try {
		// まず接続テストを実行
		await checkVoicevoxServerHealth();

		// テキストを指定して音声生成のテスト
		const text = process.argv[2] || "これはテストなのだ！速さはどうかな？";

		const audioBuffer = await generateVoice(text);

		// 生成した音声を保存
		const outputPath = join(process.cwd(), "test-output.wav");
		await writeFile(outputPath, audioBuffer);
	} catch (_error) {
		process.exit(1);
	}
}

main().catch((_error) => {
	process.exit(1);
});
