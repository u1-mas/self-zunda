const colors = {
	green: "\x1b[32m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	reset: "\x1b[0m",
};

// DEBUGモードかどうかを環境変数から取得する関数（テスト時に環境変数を変更できるようにするため）
function isDebugMode() {
	return process.env.DEBUG === "true";
}

function getTimeString() {
	const now = new Date();
	return `${now.getHours().toString().padStart(2, "0")}:${now
		.getMinutes()
		.toString()
		.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}

function logWithColor(message: string, prefix: string, color = colors.reset) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${color}[${prefix}] ${message}${colors.reset}`);
}

// loggerオブジェクトを作成
export const logger = {
	// 通常のログ出力（常に表示）
	log: (message: string) => {
		logWithColor(message, "LOG", colors.reset);
	},

	// 情報ログ出力
	info: (message: string) => {
		logWithColor(message, "INFO", colors.blue);
	},

	// デバッグログ出力（DEBUGモード時のみ表示）
	debug: (message: string) => {
		if (isDebugMode()) {
			logWithColor(message, "DEBUG", colors.yellow);
		}
	},

	// 警告ログ出力
	warn: (message: string) => {
		logWithColor(message, "WARN", colors.yellow);
	},

	// エラーログ出力
	error: (message: string, error?: unknown) => {
		logWithColor(`${message}`, "ERROR", colors.red);
		if (error) {
			// biome-ignore lint/suspicious/noConsoleLog: エラー情報の表示
			// biome-ignore lint/suspicious/noConsole: エラー情報の表示
			console.error(error);
		}
	},
};
