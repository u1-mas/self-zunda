import fs from "node:fs";
import type { PathLike } from "node:fs";
import path from "node:path";
import {
	DEFAULT_USER_SETTINGS,
	getServerDefaultSpeaker,
	getUserSettings,
	loadSettings,
	setServerDefaultSpeaker,
	updateUserSettings,
} from "./userSettings.ts";

// モックの設定
vi.mock("node:fs");
vi.mock("node:path");
vi.mock("../utils/logger", () => ({
	log: vi.fn(),
	error: vi.fn(),
}));

describe("ユーザー設定モジュール", () => {
	const mockServerId = "server123";
	const mockUserId = "user456";
	const mockConfigDir = "test-data";
	const mockConfigFile = "test-data/settings.json";

	beforeEach(() => {
		// 環境変数のモック
		vi.stubEnv("CONFIG_DIR", mockConfigDir);

		// パスのモック
		vi.mocked(path.join).mockReturnValue(mockConfigFile);

		// fsのモック
		vi.mocked(fs.existsSync).mockImplementation((filePath: PathLike) => {
			const path = filePath.toString();
			if (path === mockConfigDir) {
				return true;
			}
			if (path === mockConfigFile) {
				return false;
			}
			return false;
		});

		vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);
		vi.mocked(fs.writeFileSync).mockImplementation(() => undefined);

		// 設定を再読み込み
		loadSettings();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("getUserSettings", () => {
		it("新しいユーザーに対してデフォルト設定を返すべき", () => {
			const settings = getUserSettings(mockServerId, mockUserId);

			expect(settings).toEqual({
				userId: mockUserId,
				...DEFAULT_USER_SETTINGS,
			});
		});
	});

	describe("updateUserSettings", () => {
		it("既存のユーザー設定を更新すべき", () => {
			// まず設定を取得
			getUserSettings(mockServerId, mockUserId);

			// 設定を更新
			const updatedSettings = updateUserSettings(mockServerId, mockUserId, {
				speakerId: 2,
				speedScale: 1.5,
			});

			// 更新された設定を検証
			expect(updatedSettings.speakerId).toBe(2);
			expect(updatedSettings.speedScale).toBe(1.5);
			expect(updatedSettings.enabled).toBe(DEFAULT_USER_SETTINGS.enabled); // 他の設定は変更なし

			// saveSettingsが呼ばれたことを確認
			expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
		});
	});

	describe("サーバーデフォルト設定", () => {
		it("サーバーのデフォルト話者を設定・取得できるべき", () => {
			const newSpeakerId = 3;

			// デフォルト話者を設定
			setServerDefaultSpeaker(mockServerId, newSpeakerId);

			// 設定が保存されたことを確認
			expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

			// 設定を取得して検証
			const result = getServerDefaultSpeaker(mockServerId);
			expect(result).toBe(newSpeakerId);
		});
	});

	describe("loadSettings", () => {
		it("設定ファイルが存在しない場合はデフォルト設定を使用すべき", () => {
			// 既に beforeEach で設定ファイルは存在しないようにモックしている

			const settings = getUserSettings(mockServerId, mockUserId);

			expect(settings).toEqual({
				userId: mockUserId,
				...DEFAULT_USER_SETTINGS,
			});
		});

		it("設定ファイルが存在する場合はそれを読み込むべき", () => {
			// 設定ファイルが存在するようにモックを変更
			const mockSettings = {
				servers: {
					[mockServerId]: {
						serverId: mockServerId,
						users: {
							[mockUserId]: {
								userId: mockUserId,
								speakerId: 5,
								speedScale: 0.8,
								pitchScale: 0.2,
								intonationScale: 1.3,
								volumeScale: 1.2,
								enabled: false,
							},
						},
						defaultSpeakerId: 5,
					},
				},
			};

			// まず設定ファイルが存在することを確認
			vi.mocked(fs.existsSync).mockReturnValue(true);

			// 読み込みのモックを設定
			vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockSettings));

			// 設定を読み込み
			loadSettings();

			// 設定を取得して検証
			const settings = getUserSettings(mockServerId, mockUserId);

			// 期待する設定を個別に検証
			expect(settings.speakerId).toBe(5);
			expect(settings.speedScale).toBe(0.8);
			expect(settings.pitchScale).toBe(0.2);
			expect(settings.intonationScale).toBe(1.3);
			expect(settings.volumeScale).toBe(1.2);
			expect(settings.enabled).toBe(false);
		});
	});
});
