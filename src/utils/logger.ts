export const colors = {
	green: "\x1b[32m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
};

export function getTimeString() {
	const now = new Date();
	return `${now.getHours().toString().padStart(2, "0")}:${now
		.getMinutes()
		.toString()
		.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}

export function log(_message: string, _color = colors.reset) {}

export function error(message: string, error?: unknown) {
	console.error(`[${getTimeString()}] ${message}`, error);
}
