import { getVoiceConnection } from "@discordjs/voice";
import { getClient } from "../core/client";
import { error, log } from "../utils/logger";

let isShuttingDown = false;

export async function handleShutdown() {
	const client = getClient();
	if (isShuttingDown || !client) return;
	isShuttingDown = true;
	log("シャットダウン処理を開始するのだ...");

	// 全てのギルドのボイスチャンネルから切断
	for (const guild of client.guilds.cache.values()) {
		const connection = getVoiceConnection(guild.id);
		if (connection) {
			log(`${guild.name} のボイスチャンネルから切断するのだ...`);
			try {
				// まずボイスコネクションを破棄
				connection.destroy();
				log(`${guild.name} のボイスコネクションを破棄したのだ！`);
			} catch (err) {
				error(`${guild.name} のボイスコネクションの破棄中にエラーが発生したのだ:`, err);
			}
		}
	}

	// クライアントを破棄
	try {
		await client.destroy();
		log("クライアントを破棄して、シャットダウンを完了するのだ！");
	} catch (err) {
		error("クライアントの破棄中にエラーが発生したのだ:", err);
	} finally {
		isShuttingDown = false; // シャットダウン完了後にフラグをリセット
	}
}
