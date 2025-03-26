import fs from "node:fs";
import path from "node:path";
import { debug, error, log } from "../utils/logger.ts";

// アクティブチャンネルのデータ型
interface ActiveChannelsData {
	channels: Record<string, string>; // guildId -> channelId
}

// 設定ファイルのパス
const CONFIG_DIR = process.env.CONFIG_DIR || "data";
const CONFIG_FILE = path.join(CONFIG_DIR, "activeChannels.json");

// アクティブチャンネルのインスタンス
const activeChannels = new Map<string, string>();

/**
 * 設定ディレクトリの初期化
 */
function initConfigDir(): void {
	try {
		if (!fs.existsSync(CONFIG_DIR)) {
			log(`設定ディレクトリ ${CONFIG_DIR} を作成するのだ`);
			fs.mkdirSync(CONFIG_DIR, { recursive: true });
		}
	} catch (err) {
		error(`設定ディレクトリの作成に失敗したのだ: ${err}`);
		throw err;
	}
}

/**
 * アクティブチャンネル設定の読み込み
 */
export function loadActiveChannels(): void {
	try {
		initConfigDir();

		if (fs.existsSync(CONFIG_FILE)) {
			debug(`アクティブチャンネル設定ファイル ${CONFIG_FILE} を読み込むのだ`);
			const data = fs.readFileSync(CONFIG_FILE, "utf8");
			const channelsData: ActiveChannelsData = JSON.parse(data);

			// Mapをクリアして読み込んだデータで初期化
			activeChannels.clear();
			for (const [guildId, channelId] of Object.entries(channelsData.channels)) {
				activeChannels.set(guildId, channelId);
			}

			debug("アクティブチャンネル設定の読み込みが完了したのだ");
		} else {
			debug("アクティブチャンネル設定ファイルがないので、空の状態で開始するのだ");
			saveActiveChannels(); // 空の設定を保存
		}
	} catch (err) {
		error(`アクティブチャンネル設定の読み込みに失敗したのだ: ${err}`);
		// エラー時は空のMapを使用
		activeChannels.clear();
	}
}

/**
 * アクティブチャンネル設定の保存
 */
export function saveActiveChannels(): void {
	try {
		initConfigDir();

		// Mapからオブジェクトに変換
		const channelsData: ActiveChannelsData = {
			channels: Object.fromEntries(activeChannels),
		};

		debug(`アクティブチャンネル設定ファイル ${CONFIG_FILE} に保存するのだ`);
		fs.writeFileSync(CONFIG_FILE, JSON.stringify(channelsData, null, 2), "utf8");
		debug("アクティブチャンネル設定の保存が完了したのだ");
	} catch (err) {
		error(`アクティブチャンネル設定の保存に失敗したのだ: ${err}`);
		throw err;
	}
}

/**
 * 指定されたサーバーとチャンネルが読み上げ有効かどうかを確認する
 * @param guildId サーバーID
 * @param channelId チャンネルID
 * @returns 読み上げが有効な場合はtrue
 */
export function isTextToSpeechEnabled(guildId: string, channelId: string): boolean {
	return activeChannels.get(guildId) === channelId;
}

/**
 * 指定されたサーバーとチャンネルの読み上げを有効にする
 * @param guildId サーバーID
 * @param channelId チャンネルID
 */
export function enableTextToSpeech(guildId: string, channelId: string): void {
	activeChannels.set(guildId, channelId);
	saveActiveChannels();
}

/**
 * 指定されたサーバーの読み上げを無効にする
 * @param guildId サーバーID
 */
export function disableTextToSpeech(guildId: string): void {
	activeChannels.delete(guildId);
	saveActiveChannels();
}

/**
 * アクティブなチャンネルのMapを取得する
 * @returns アクティブチャンネルのMap
 */
export function getActiveChannels(): Map<string, string> {
	return new Map(activeChannels);
}

// 初期化時にアクティブチャンネル設定を読み込む
loadActiveChannels();
