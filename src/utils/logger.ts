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
export function log(_message: string, _color = colors.reset) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${_color}[LOG]${colors.reset} ${_message}`);
}

// 情報ログ出力
export function info(_message: string) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${colors.blue}[INFO]${colors.reset} ${_message}`);
}

// デバッグログ出力（DEBUGモード時のみ表示）
export function debug(_message: string, _color = colors.yellow) {
	if (isDebugMode()) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(`${getTimeString()} ${_color}[DEBUG]${colors.reset} ${_message}`);
	}
}

// 警告ログ出力
export function warn(_message: string) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${colors.yellow}[WARN]${colors.reset} ${_message}`);
}

// エラーログ出力
export function error(_message: string, _error?: unknown) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`${getTimeString()} ${colors.red}[ERROR]${colors.reset} ${_message}`);
}
