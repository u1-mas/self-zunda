import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commandsData } from "../handlers/commands";
import { logger } from "../utils/logger";

// 環境変数を読み込む
config();

// 環境変数の確認
if (!(process.env.DISCORD_TOKEN && process.env.CLIENT_ID)) {
	throw new Error("必要な環境変数が設定されていないのだ！");
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// コマンドを登録する関数
export async function deployCommands() {
	try {
		logger.log("スラッシュコマンドを登録しています...");

		const clientId = process.env.CLIENT_ID;
		if (!clientId) {
			throw new Error("CLIENT_IDが設定されていないのだ！");
		}

		await rest.put(Routes.applicationCommands(clientId), {
			body: commandsData,
		});

		logger.log("スラッシュコマンドの登録に成功しました！");
		return true;
	} catch (err) {
		logger.error(`スラッシュコマンドの登録中にエラーが発生しました: ${err}`);
		return false;
	}
}

// スクリプトが直接実行された場合にコマンドを登録
if (import.meta.url === `file://${process.argv[1]}`) {
	await deployCommands();
}
