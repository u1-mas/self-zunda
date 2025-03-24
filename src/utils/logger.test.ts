import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { colors, debug, error, getTimeString, info, log, warn } from "./logger";

describe("logger", () => {
	beforeEach(() => {
		// コンソール出力をモックする
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});

		// 日付をモックして固定値を返すようにする
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2023, 3, 1, 12, 34, 56));
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("getTimeString", () => {
		it("現在時刻を適切な形式で返すこと", () => {
			expect(getTimeString()).toBe("12:34:56");
		});
	});

	describe("log", () => {
		it("指定された色とメッセージでログを出力すること", () => {
			const message = "テストメッセージ";
			log(message, colors.green);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.green}[12:34:56] ${message}${colors.reset}`,
			);
		});

		it("色が指定されていない場合はデフォルト色を使用すること", () => {
			const message = "テストメッセージ";
			log(message);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.reset}[12:34:56] ${message}${colors.reset}`,
			);
		});
	});

	describe("info", () => {
		it("青色でINFO接頭辞付きのログを出力すること", () => {
			const message = "情報メッセージ";
			info(message);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.blue}[INFO][12:34:56] ${message}${colors.reset}`,
			);
		});
	});

	describe("debug", () => {
		it("DEBUGモードがtrueの場合、黄色でDEBUG接頭辞付きのログを出力すること", () => {
			// DEBUGモードをtrueに設定
			const originalEnv = process.env.DEBUG;
			process.env.DEBUG = "true";

			const message = "デバッグメッセージ";
			debug(message);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.yellow}[DEBUG][12:34:56] ${message}${colors.reset}`,
			);

			// 環境変数を元に戻す
			process.env.DEBUG = originalEnv;
		});

		it("DEBUGモードがfalseの場合、ログを出力しないこと", () => {
			// DEBUGモードをfalseに設定
			const originalEnv = process.env.DEBUG;
			process.env.DEBUG = "false";

			const message = "デバッグメッセージ";
			debug(message);

			expect(console.log).not.toHaveBeenCalled();

			// 環境変数を元に戻す
			process.env.DEBUG = originalEnv;
		});

		it("色を指定できること", () => {
			// DEBUGモードをtrueに設定
			const originalEnv = process.env.DEBUG;
			process.env.DEBUG = "true";

			const message = "デバッグメッセージ";
			debug(message, colors.green);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.green}[DEBUG][12:34:56] ${message}${colors.reset}`,
			);

			// 環境変数を元に戻す
			process.env.DEBUG = originalEnv;
		});
	});

	describe("warn", () => {
		it("黄色でWARN接頭辞付きのログを出力すること", () => {
			const message = "警告メッセージ";
			warn(message);

			expect(console.log).toHaveBeenCalledWith(
				`${colors.yellow}[WARN][12:34:56] ${message}${colors.reset}`,
			);
		});
	});

	describe("error", () => {
		it("赤色でエラーメッセージを出力すること", () => {
			const message = "エラーメッセージ";
			error(message);

			expect(console.error).toHaveBeenCalledWith(
				`${colors.red}[12:34:56] ${message}${colors.reset}`,
				undefined,
			);
		});

		it("エラーオブジェクトがある場合、追加情報として出力すること", () => {
			const message = "エラーメッセージ";
			const errorObj = new Error("テストエラー");
			error(message, errorObj);

			expect(console.error).toHaveBeenCalledWith(
				`${colors.red}[12:34:56] ${message}${colors.reset}`,
				errorObj,
			);
		});
	});
});
