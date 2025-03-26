import { logger } from "./logger";

describe("logger", () => {
	beforeEach(() => {
		// コンソール出力をモックする
		// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
		vi.spyOn(console, "log").mockImplementation(() => {});
		// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
		vi.spyOn(console, "error").mockImplementation(() => {});

		// 日付をモックして固定値を返すようにする
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2023, 3, 1, 12, 34, 56));
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("log", () => {
		it("適切な形式でログを出力すること", () => {
			const message = "テストメッセージ";
			logger.log(message);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[LOG] ${message}`));
		});
	});

	describe("info", () => {
		it("INFO接頭辞付きのログを出力すること", () => {
			const message = "情報メッセージ";
			logger.info(message);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[INFO] ${message}`));
		});
	});

	describe("debug", () => {
		it("DEBUGモードがtrueの場合、DEBUG接頭辞付きのログを出力すること", () => {
			// DEBUGモードをtrueに設定
			const originalEnv = process.env.DEBUG;
			process.env.DEBUG = "true";

			const message = "デバッグメッセージ";
			logger.debug(message);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[DEBUG] ${message}`));

			// 環境変数を元に戻す
			process.env.DEBUG = originalEnv;
		});

		it("DEBUGモードがfalseの場合、ログを出力しないこと", () => {
			// DEBUGモードをfalseに設定
			const originalEnv = process.env.DEBUG;
			process.env.DEBUG = "false";

			const message = "デバッグメッセージ";
			logger.debug(message);

			expect(console.log).not.toHaveBeenCalled();

			// 環境変数を元に戻す
			process.env.DEBUG = originalEnv;
		});
	});

	describe("warn", () => {
		it("WARN接頭辞付きのログを出力すること", () => {
			const message = "警告メッセージ";
			logger.warn(message);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[WARN] ${message}`));
		});
	});

	describe("error", () => {
		it("エラーメッセージを出力すること", () => {
			const message = "エラーメッセージ";
			logger.error(message);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[ERROR] ${message}`));
		});

		it("エラーオブジェクトがある場合、追加情報として出力すること", () => {
			const message = "エラーメッセージ";
			const errorObj = new Error("テストエラー");
			logger.error(message, errorObj);

			expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`[ERROR] ${message}`));
			expect(console.error).toHaveBeenCalledWith(errorObj);
		});
	});
});
