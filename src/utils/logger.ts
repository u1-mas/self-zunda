export const colors = {
	green: "\x1b[32m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	reset: "\x1b[0m",
};

// DEBUGモードかどうかを環境変数から取得（デフォルトはfalse）
const isDebugMode = process.env.DEBUG === "true";

export function getTimeString() {
	const now = new Date();
	return `${now.getHours().toString().padStart(2, "0")}:${now
		.getMinutes()
		.toString()
		.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}

// 通常のログ出力（常に表示）
export function log(message: string, color = colors.reset) {
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	console.log(`${color}[${getTimeString()}] ${message}${colors.reset}`);
}

// デバッグログ出力（DEBUGモード時のみ表示）
export function debug(message: string, color = colors.yellow) {
	if (isDebugMode) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(`${color}[DEBUG][${getTimeString()}] ${message}${colors.reset}`);
	}
}

export function error(message: string, error?: unknown) {
	console.error(`[${getTimeString()}] ${message}`, error);
}
