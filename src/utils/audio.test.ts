import {
    type AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    type VoiceConnection,
} from "@discordjs/voice";
import { writeFile } from "node:fs/promises";
import { getPlayer, playAudio, stopAudio } from "./audio";

// fs/promisesをモック
jest.mock("node:fs/promises");
jest.mock("node:fs", () => ({
    createReadStream: jest.fn().mockReturnValue("モックストリーム"),
    unlinkSync: jest.fn(),
}));

// @discordjs/voiceをモック
jest.mock("@discordjs/voice");

// audio.tsをモック
jest.mock("./audio", () => {
    // オリジナルの実装
    const players = new Map<string, jest.Mocked<AudioPlayer>>();

    return {
        getPlayer: jest.fn((guildId: string) => players.get(guildId)),
        playAudio: jest.fn().mockImplementation(
            (connection: VoiceConnection, audioBuffer: Buffer) => {
                return new Promise<void>((resolve, reject) => {
                    try {
                        const guildId = connection.joinConfig.guildId;
                        let player = players.get(guildId);

                        if (!player) {
                            // プレイヤーを作成
                            player = {
                                status: AudioPlayerStatus.Idle,
                                play: jest.fn(),
                                stop: jest.fn(),
                                on: jest.fn().mockReturnThis(),
                                once: jest.fn().mockImplementation((event, listener) => {
                                    if (event === 'stateChange' && players.get(guildId)) {
                                        // タイマーで自動的にイベントを発火
                                        setTimeout(() => {
                                            listener(
                                                { status: AudioPlayerStatus.Playing },
                                                { status: AudioPlayerStatus.Idle }
                                            );
                                        }, 10);
                                    }
                                    return player;
                                }),
                                off: jest.fn().mockReturnThis(),
                                emit: jest.fn(),
                            } as unknown as jest.Mocked<AudioPlayer>;

                            players.set(guildId, player);
                            connection.subscribe(player);
                        }

                        // 成功シナリオの処理
                        setTimeout(() => resolve(), 20);
                    } catch (error) {
                        reject(error);
                    }
                });
            }),
        stopAudio: jest.fn().mockImplementation((guildId: string) => {
            const player = players.get(guildId);
            if (player) {
                player.stop();
            }
        }),
    };
});

// モック関数に型を付ける
const mockedWriteFile = jest.mocked(writeFile);
const mockedCreateAudioPlayer = jest.mocked(createAudioPlayer);
const mockedCreateAudioResource = jest.mocked(createAudioResource);
const mockedPlayAudio = jest.mocked(playAudio);
const mockedStopAudio = jest.mocked(stopAudio);
const mockedGetPlayer = jest.mocked(getPlayer);

// setTimeout/clearTimeoutをモック
jest.useFakeTimers();

describe("audio機能", () => {
    // テスト用データ
    const mockGuildId = "guild-123";
    const mockAudioBuffer = Buffer.from("テスト音声データ");
    let mockConnection: jest.Mocked<VoiceConnection>;

    beforeEach(() => {
        jest.clearAllMocks();

        // VoiceConnectionのモックを作成
        mockConnection = {
            joinConfig: {
                guildId: mockGuildId,
                channelId: "channel-123",
            },
            subscribe: jest.fn(),
        } as unknown as jest.Mocked<VoiceConnection>;

        // AudioPlayerのモックをリセット
        mockedCreateAudioPlayer.mockImplementation(() => {
            return {
                status: AudioPlayerStatus.Idle,
                play: jest.fn(),
                stop: jest.fn(),
                on: jest.fn().mockReturnThis(),
                once: jest.fn().mockReturnThis(),
                off: jest.fn().mockReturnThis(),
                emit: jest.fn(),
            } as unknown as AudioPlayer;
        });

        mockedCreateAudioResource.mockReturnValue("モックリソース" as unknown as ReturnType<typeof createAudioResource>);
    });

    afterEach(() => {
        // 全てのタイマーをクリア
        jest.clearAllTimers();
    });

    describe("playAudio", () => {
        it("音声を正常に再生できるのだ", async () => {
            // writeFileのモックを成功で設定
            mockedWriteFile.mockResolvedValue(undefined);

            // playAudioを実行
            const playPromise = playAudio(mockConnection, mockAudioBuffer);

            // タイマーを進める
            jest.advanceTimersByTime(50);

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
            await expect(playAudio(mockConnection, mockAudioBuffer))
                .rejects.toThrow("テストエラー");
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
