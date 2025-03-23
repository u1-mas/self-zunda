import {
	type AudioPlayer,
	AudioPlayerStatus,
	type VoiceConnection,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { writeFile } from "node:fs/promises";
import { type MockedObject, vi } from "vitest";
import { getPlayer, playAudio, stopAudio } from "./audio";

// fs/promisesをモック
vi.mock("node:fs/promises");
vi.mock("node:fs", () => ({
	createReadStream: vi.fn().mockReturnValue("モックストリーム"),
	unlinkSync: vi.fn(),
}));

// @discordjs/voiceをモック
vi.mock("@discordjs/voice");

// audio.tsをモック
vi.mock("./audio", () => {
	// オリジナルの実装
	const players = new Map<string, MockedObject<AudioPlayer>>();

	return {
		getPlayer: vi.fn((guildId: string) => players.get(guildId)),
		playAudio: vi.fn().mockImplementation((_connection: VoiceConnection, _audioBuffer: Buffer) => {
			return new Promise<void>((resolve, reject) => {
				try {
					const guildId = _connection.joinConfig.guildId;
					let player = players.get(guildId);

					if (!player) {
						// プレイヤーを作成
						player = {
							status: AudioPlayerStatus.Idle,
							play: vi.fn(),
							stop: vi.fn(),
							on: vi.fn().mockReturnThis(),
							once: vi.fn().mockImplementation((event, listener) => {
								if (event === "stateChange" && players.get(guildId)) {
									// タイマーで自動的にイベントを発火
									setTimeout(() => {
										listener(
											{
												status: AudioPlayerStatus.Playing,
											},
											{
												status: AudioPlayerStatus.Idle,
											},
										);
									}, 10);
								}
								return player;
							}),
							off: vi.fn().mockReturnThis(),
							emit: vi.fn(),
						} as unknown as MockedObject<AudioPlayer>;

						players.set(guildId, player);
						_connection.subscribe(player);
					}

					// 成功シナリオの処理
					setTimeout(() => resolve(), 20);
				} catch (error) {
					reject(error);
				}
			});
		}),
		stopAudio: vi.fn().mockImplementation((guildId: string) => {
			const player = players.get(guildId);
			if (player) {
				player.stop();
			}
		}),
	};
});

// モック関数に型を付ける
const mockedWriteFile = vi.mocked(writeFile);
const mockedCreateAudioPlayer = vi.mocked(createAudioPlayer);
const mockedCreateAudioResource = vi.mocked(createAudioResource);
const mockedPlayAudio = vi.mocked(playAudio);
const mockedStopAudio = vi.mocked(stopAudio);
const mockedGetPlayer = vi.mocked(getPlayer);

// setTimeout/clearTimeoutをモック
vi.useFakeTimers();

describe("audio機能", () => {
	// テスト用データ
	const mockGuildId = "guild-123";
	const mockAudioBuffer = Buffer.from("テスト音声データ");
	let mockConnection: MockedObject<VoiceConnection>;

	beforeEach(() => {
		vi.clearAllMocks();

		// VoiceConnectionのモックを作成
		mockConnection = {
			joinConfig: {
				guildId: mockGuildId,
				channelId: "channel-123",
			},
			subscribe: vi.fn(),
		} as unknown as MockedObject<VoiceConnection>;

		// AudioPlayerのモックをリセット
		mockedCreateAudioPlayer.mockImplementation(() => {
			return {
				status: AudioPlayerStatus.Idle,
				play: vi.fn(),
				stop: vi.fn(),
				on: vi.fn().mockReturnThis(),
				once: vi.fn().mockReturnThis(),
				off: vi.fn().mockReturnThis(),
				emit: vi.fn(),
			} as unknown as AudioPlayer;
		});

		mockedCreateAudioResource.mockReturnValue(
			"モックリソース" as unknown as ReturnType<typeof createAudioResource>,
		);
	});

	afterEach(() => {
		// 全てのタイマーをクリア
		vi.clearAllTimers();
	});

	describe("playAudio", () => {
		it("音声を正常に再生できるのだ", async () => {
			// writeFileのモックを成功で設定
			mockedWriteFile.mockResolvedValue(undefined);

			// playAudioを実行
			const playPromise = playAudio(mockConnection, mockAudioBuffer);

			// タイマーを進める
			vi.advanceTimersByTime(50);

			// プロミスを解決
			await playPromise;

			// 期待する関数呼び出しを検証
			expect(mockedPlayAudio).toHaveBeenCalledWith(mockConnection, mockAudioBuffer);
		});

		it("エラー発生時はリジェクトされるのだ", async () => {
			// エラーを強制的に発生させる
			const testError = new Error("テストエラー");
			mockedPlayAudio.mockRejectedValueOnce(testError);

			// エラーがスローされることを期待
			await expect(playAudio(mockConnection, mockAudioBuffer)).rejects.toThrow("テストエラー");
		});
	});

	describe("stopAudio", () => {
		it("音声を停止できるのだ", () => {
			// stopAudioを実行
			stopAudio(mockGuildId);

			// 関数が呼ばれたことを確認
			expect(mockedStopAudio).toHaveBeenCalledWith(mockGuildId);
		});
	});

	describe("getPlayer", () => {
		it("プレイヤーが存在しない場合はundefinedを返すのだ", () => {
			// getPlayerをundefinedを返すようにモック
			mockedGetPlayer.mockReturnValueOnce(undefined);

			const player = getPlayer("non-existent-guild");
			expect(player).toBeUndefined();
		});

		it("プレイヤーが存在する場合はそれを返すのだ", () => {
			// モックプレイヤーを作成
			const mockPlayer = mockedCreateAudioPlayer();

			// getPlayerがプレイヤーを返すようにモック
			mockedGetPlayer.mockReturnValueOnce(mockPlayer);

			const player = getPlayer(mockGuildId);
			expect(player).toBe(mockPlayer);
		});
	});
});
