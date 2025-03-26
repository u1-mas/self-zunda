import { getVoiceConnections } from "@discordjs/voice";
import { info } from "../utils/logger";
import { handleShutdown } from "./shutdownHandler";

// モック
vi.mock("@discordjs/voice", () => ({
	getVoiceConnections: vi.fn(),
	getVoiceConnection: vi.fn(),
}));

vi.mock("../utils/logger", () => ({
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
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

	beforeEach(() => {
		vi.resetAllMocks();

		// コネクションマップのモック
		mockConnectionMap = new Map();
		mockConnectionMap.set("connection1", { destroy: vi.fn() });
		mockConnectionMap.set("connection2", { destroy: vi.fn() });

		(getVoiceConnections as ReturnType<typeof vi.fn>).mockReturnValue(mockConnectionMap);
	});

	it("SIGINTシグナルが処理されてシャットダウンが実行されること", () => {
		// ハンドラーをセットアップ
		handleShutdown();

		// SIGINTイベントをシミュレート
		process.emit("SIGINT");

		// 各コネクションのdestroyが呼ばれたことを確認
		for (const connection of mockConnectionMap.values()) {
			expect(connection.destroy).toHaveBeenCalled();
		}

		// ログが出力されたことを確認
		expect(info).toHaveBeenCalledWith(expect.stringContaining("シャットダウンを開始"));
		expect(info).toHaveBeenCalledWith(expect.stringContaining("ボイスコネクションを切断"));

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});

	it("SIGTERMシグナルが処理されてシャットダウンが実行されること", () => {
		// ハンドラーをセットアップ
		handleShutdown();

		// SIGTERMイベントをシミュレート
		process.emit("SIGTERM");

		// 各コネクションのdestroyが呼ばれたことを確認
		for (const connection of mockConnectionMap.values()) {
			expect(connection.destroy).toHaveBeenCalled();
		}

		// ログが出力されたことを確認
		expect(info).toHaveBeenCalledWith(expect.stringContaining("シャットダウンを開始"));
		expect(info).toHaveBeenCalledWith(expect.stringContaining("ボイスコネクションを切断"));

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});

	it("コネクションがない場合もシャットダウンが正常に実行されること", () => {
		// コネクションがない状態に設定
		(getVoiceConnections as ReturnType<typeof vi.fn>).mockReturnValue(new Map());

		// ハンドラーをセットアップ
		handleShutdown();

		// SIGINTイベントをシミュレート
		process.emit("SIGINT");

		// ログが出力されたことを確認
		expect(info).toHaveBeenCalledWith(expect.stringContaining("シャットダウンを開始"));
		expect(info).toHaveBeenCalledWith(expect.stringContaining("ボイスコネクションを切断"));
		expect(info).toHaveBeenCalledWith(
			expect.stringContaining("アクティブなボイスコネクションはありません"),
		);

		// プロセスが終了したことを確認
		expect(mockExit).toHaveBeenCalledWith(0);
	});
});
