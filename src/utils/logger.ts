export const colors = {
	green: "\x1b[32m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	reset: "\x1b[0m",
};

// DEBUGモードかどうかを環境変数から取得する関数（テスト時に環境変数を変更できるようにするため）
export function isDebugMode() {
	return process.env.DEBUG === "true";
}

export function getTimeString() {
	const now = new Date();
	return `${now.getHours().toString().padStart(2, "0")}:${now
		.getMinutes()
		.toString()
		.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}

// 通常のログ出力（常に表示）
export function log(_message: string) {
	logWithColor(_message, "LOG", colors.reset);
}

// 情報ログ出力
export function info(_message: string) {
	logWithColor(_message, "INFO", colors.blue);
}

// デバッグログ出力（DEBUGモード時のみ表示）
export function debug(_message: string) {
	if (isDebugMode()) {
		logWithColor(_message, "DEBUG", colors.yellow);
	}
}

// 警告ログ出力
export function warn(_message: string) {
	logWithColor(_message, "WARN", colors.yellow);
}

// エラーログ出力
export function error(_message: string, _error?: unknown) {
	logWithColor(_message, "ERROR", colors.red);
}

function logWithColor(message: string, prefix: string, color = colors.reset) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${color}[${prefix}] ${message}`);
}
