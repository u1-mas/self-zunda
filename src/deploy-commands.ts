import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commandsData } from "./handlers/commands";

config();

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
	throw new Error("必要な環境変数が設定されていないのだ！");
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log("スラッシュコマンドの登録を開始するのだ...");

		await rest.put(Routes.applicationCommands(CLIENT_ID), {
			body: commandsData,
		});

		console.log("スラッシュコマンドの登録が完了したのだ！");
	} catch (error) {
		console.error("スラッシュコマンドの登録中にエラーが発生したのだ:", error);
	}
})();
