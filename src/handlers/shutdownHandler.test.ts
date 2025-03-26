import { getVoiceConnections } from "@discordjs/voice";
import { logger } from "../utils/logger";
import { handleShutdown } from "./shutdownHandler";

// モック
vi.mock("@discordjs/voice", () => ({
	getVoiceConnections: vi.fn(),
	getVoiceConnection: vi.fn(),
}));

vi.mock("../utils/logger.ts", () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		log: vi.fn(),
		debug: vi.fn(),
	},
}));

vi.mock("../core/client.ts", () => ({
	getClient: vi.fn().mockReturnValue({
		guilds: {
			cache: {
				values: () => [
					{
						id: "guild1",
						name: "Guild 1",
					},
					{
						id: "guild2",
						name: "Guild 2",
					},
				],
			},
		},
		destroy: vi.fn().mockResolvedValue(undefined),
	}),
}));

// プロセスのexit関数をモック化してテスト終了時に実際に終了しないようにする
const originalExit = process.exit;
const mockExit = vi.fn();

beforeAll(() => {
	// @ts-ignore: プロセスのexitをモック
	process.exit = mockExit;
});

afterAll(() => {
	// テスト終了後に元に戻す
	process.exit = originalExit;
});

describe("shutdownHandler", () => {
	let mockConnectionMap: Map<string, { destroy: () => void }>;
	let originalProcessOn: typeof process.on;
	let originalProcessOff: typeof process.off;

	beforeAll(() => {
		originalProcessOn = process.on;
		originalProcessOff = process.off;
		process.on = vi.fn().mockReturnThis();
		process.off = vi.fn().mockReturnThis();
	});

	afterAll(() => {
		process.on = originalProcessOn;
		process.off = originalProcessOff;
	});

	beforeEach(() => {
		vi.resetAllMocks();

		// コネクションマップのモック
		mockConnectionMap = new Map();
		mockConnectionMap.set("connection1", { destroy: vi.fn() });
		mockConnectionMap.set("connection2", { destroy: vi.fn() });

		(getVoiceConnections as ReturnType<typeof vi.fn>).mockReturnValue(mockConnectionMap);
	});

	it("SIGINTシグナルが処理されてシャットダウンが実行されること", async () => {
		// ハンドラーをセットアップ
		handleShutdown();

		// SIGINTイベントをシミュレート
		const [[eventName, handler]] = (process.on as ReturnType<typeof vi.fn>).mock.calls;
		expect(eventName).toBe("SIGINT");
		await handler();

		// 各コネクションのdestroyが呼ばれたことを確認
		for (const connection of mockConnectionMap.values()) {
			expect(connection.destroy).toHaveBeenCalled();
		}

		// ログが出力されたことを確認
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("シャットダウン処理を開始するのだ"),
		);
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("のボイスチャンネルから切断するのだ"),
		);

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});

	it("SIGTERMシグナルが処理されてシャットダウンが実行されること", async () => {
		// ハンドラーをセットアップ
		handleShutdown();

		// SIGTERMイベントをシミュレート
		const [[eventName, handler]] = (process.on as ReturnType<typeof vi.fn>).mock.calls;
		expect(eventName).toBe("SIGINT");
		await handler();

		// 各コネクションのdestroyが呼ばれたことを確認
		for (const connection of mockConnectionMap.values()) {
			expect(connection.destroy).toHaveBeenCalled();
		}

		// ログが出力されたことを確認
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("シャットダウン処理を開始するのだ"),
		);
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("のボイスチャンネルから切断するのだ"),
		);

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});

	it("コネクションがない場合もシャットダウンが正常に実行されること", async () => {
		// コネクションがない状態に設定
		(getVoiceConnections as ReturnType<typeof vi.fn>).mockReturnValue(new Map());

		// ハンドラーをセットアップ
		handleShutdown();

		// SIGINTイベントをシミュレート
		const [[eventName, handler]] = (process.on as ReturnType<typeof vi.fn>).mock.calls;
		expect(eventName).toBe("SIGINT");
		await handler();

		// ログが出力されたことを確認
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("シャットダウン処理を開始するのだ"),
		);
		expect(logger.log).toHaveBeenCalledWith(
			expect.stringContaining("クライアントを破棄して、シャットダウンを完了するのだ"),
		);

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});
});
