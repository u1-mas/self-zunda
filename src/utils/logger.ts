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
export function log(_message: string, _color = colors.reset) {}

// 情報ログ出力
export function info(_message: string) {}

// デバッグログ出力（DEBUGモード時のみ表示）
export function debug(_message: string, _color = colors.yellow) {
	if (isDebugMode()) {
	}
}

// 警告ログ出力
export function warn(_message: string) {}

// エラーログ出力
export function error(_message: string, _error?: unknown) {}
