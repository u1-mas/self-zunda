import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/logger";

// ユーザー設定の型定義
interface UserSettings {
	userId: string;
	speakerId: number; // 話者ID
	speedScale: number; // 読み上げ速度
	pitchScale: number; // 音の高さ
	intonationScale: number; // イントネーションの強さ
	volumeScale: number; // 音量
	enabled: boolean; // 読み上げ有効/無効
}

// サーバー設定の型定義
interface ServerSettings {
	serverId: string;
	users: Record<string, UserSettings>; // ユーザーIDをキーとしたユーザー設定のマップ
	defaultSpeakerId: number; // デフォルトの話者ID
}

// 全サーバーの設定を含むデータ型
interface AllSettings {
	servers: Record<string, ServerSettings>; // サーバーIDをキーとしたサーバー設定のマップ
}

// デフォルト設定
export const DEFAULT_USER_SETTINGS: Omit<UserSettings, "userId"> = {
	speakerId: 1, // ずんだもん（あまあま）
	speedScale: 1.0, // 標準速度
	pitchScale: 0.0, // 標準の高さ
	intonationScale: 1.2, // 少し強めのイントネーション
	volumeScale: 1.0, // 標準音量
	enabled: true, // デフォルトで有効
};

// 設定ファイルのパス
const CONFIG_DIR = process.env.CONFIG_DIR || "data";
const CONFIG_FILE = path.join(CONFIG_DIR, "settings.json");

// 設定データのインスタンス
let settingsData: AllSettings = {
	servers: {},
};

// 設定ディレクトリの初期化
function initConfigDir(): void {
	try {
		if (!fs.existsSync(CONFIG_DIR)) {
			logger.log(`設定ディレクトリ ${CONFIG_DIR} を作成するのだ`);
			fs.mkdirSync(CONFIG_DIR, { recursive: true });
		}
	} catch (err) {
		logger.error(`設定ディレクトリの作成に失敗したのだ: ${err}`);
		throw err;
	}
}

// 設定の読み込み
export function loadSettings(): void {
	try {
		initConfigDir();

		if (fs.existsSync(CONFIG_FILE)) {
			logger.log(`設定ファイル ${CONFIG_FILE} を読み込むのだ`);
			const data = fs.readFileSync(CONFIG_FILE, "utf8");
			settingsData = JSON.parse(data);
			logger.log("設定の読み込みが完了したのだ");
		} else {
			logger.log("設定ファイルがないので、デフォルト設定を使用するのだ");
			saveSettings(); // デフォルト設定を保存
		}
	} catch (err) {
		logger.error(`設定の読み込みに失敗したのだ: ${err}`);
		// エラー時はデフォルト設定を使用
		settingsData = { servers: {} };
	}
}

// 設定の保存
function saveSettings(): void {
	try {
		initConfigDir();
		logger.log(`設定ファイル ${CONFIG_FILE} に保存するのだ`);
		fs.writeFileSync(CONFIG_FILE, JSON.stringify(settingsData, null, 2), "utf8");
		logger.log("設定の保存が完了したのだ");
	} catch (err) {
		logger.error(`設定の保存に失敗したのだ: ${err}`);
		throw err;
	}
}

// ユーザー設定の取得
export function getUserSettings(serverId: string, userId: string): UserSettings {
	// サーバー設定が存在しなければ作成
	if (!settingsData.servers[serverId]) {
		settingsData.servers[serverId] = {
			serverId,
			users: {},
			defaultSpeakerId: DEFAULT_USER_SETTINGS.speakerId,
		};
	}

	// ユーザー設定が存在しなければデフォルト設定で作成
	if (!settingsData.servers[serverId].users[userId]) {
		settingsData.servers[serverId].users[userId] = {
			userId,
			...DEFAULT_USER_SETTINGS,
		};
	}

	return settingsData.servers[serverId].users[userId];
}

// ユーザー設定の更新
export function updateUserSettings(
	serverId: string,
	userId: string,
	settings: Partial<Omit<UserSettings, "userId">>,
): UserSettings {
	const currentSettings = getUserSettings(serverId, userId);
	const newSettings = { ...currentSettings, ...settings };

	settingsData.servers[serverId].users[userId] = newSettings;
	saveSettings();

	return newSettings;
}

// サーバーのデフォルト話者設定
export function setServerDefaultSpeaker(serverId: string, speakerId: number): void {
	if (settingsData.servers[serverId]) {
		settingsData.servers[serverId].defaultSpeakerId = speakerId;
	} else {
		settingsData.servers[serverId] = {
			serverId,
			users: {},
			defaultSpeakerId: speakerId,
		};
	}

	saveSettings();
}

// サーバーのデフォルト話者取得
export function getServerDefaultSpeaker(serverId: string): number {
	if (!settingsData.servers[serverId]) {
		settingsData.servers[serverId] = {
			serverId,
			users: {},
			defaultSpeakerId: DEFAULT_USER_SETTINGS.speakerId,
		};
		saveSettings();
	}

	return settingsData.servers[serverId].defaultSpeakerId;
}

// 初期化時に設定を読み込む
loadSettings();
