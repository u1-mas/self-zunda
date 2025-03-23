export const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
};

export function getTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${
        now
            .getMinutes()
            .toString()
            .padStart(2, "0")
    }:${now.getSeconds().toString().padStart(2, "0")}`;
}

export function log(message: string) {
    console.log(
        `${colors.cyan}[${getTimeString()}]${colors.reset} ${colors.green}${message}${colors.reset}`,
    );
}

export function error(message: string, error?: unknown) {
    if (error) {
        console.error(
            `${colors.red}[${getTimeString()}] エラー: ${message}${colors.reset}`,
            error,
        );
    } else {
        console.error(
            `${colors.red}[${getTimeString()}] エラー: ${message}${colors.reset}`,
        );
    }
}
