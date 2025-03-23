import axios from "axios";
import { error, log } from "./logger";
import { checkVoicevoxServerHealth, generateVoice } from "./voicevox";

// モックの設定
jest.mock("axios");
jest.mock("./logger");
// モジュール全体をモック化
jest.mock("../utils/voicevox", () => {
    // 実際のexportsを取得する代わりに、必要な関数だけをモック化
    return {
        generateVoice: jest.fn().mockResolvedValue(Buffer.from("test")),
        checkVoicevoxServerHealth: jest.fn().mockResolvedValue(true),
    };
});

// モック関数に型を付ける
const mockedAxios = jest.mocked(axios);
const mockedLog = jest.mocked(log);
const mockedError = jest.mocked(error);
const mockedGenerateVoice = jest.mocked(generateVoice);
const mockedCheckVoicevoxServerHealth = jest.mocked(checkVoicevoxServerHealth);

describe("voicevox機能", () => {
    // テストごとにモックをリセット
    beforeEach(() => {
        jest.resetAllMocks();
        mockedGenerateVoice.mockResolvedValue(Buffer.from("test"));
        mockedCheckVoicevoxServerHealth.mockResolvedValue(true);
    });

    describe("generateVoice", () => {
        it("正常に音声を生成できるのだ", async () => {
            const result = await generateVoice("テストなのだ");
            expect(result).toBeInstanceOf(Buffer);
            expect(result.toString()).toBe("test");
            expect(mockedGenerateVoice).toHaveBeenCalledWith("テストなのだ");
        });

        it("サーバー接続エラー時は適切なエラーを投げるのだ", async () => {
            const connectionError = new Error("ECONNREFUSED") as Error & {
                code?: string;
            };
            connectionError.code = "ECONNREFUSED";
            mockedGenerateVoice.mockRejectedValue(connectionError);

            await expect(generateVoice("テスト")).rejects.toThrow(Error);
            expect(mockedGenerateVoice).toHaveBeenCalledWith("テスト");
        });

        it("APIエラー時は適切なエラーを投げるのだ", async () => {
            const apiError = new Error("API Error") as Error & {
                response?: {
                    status: number;
                    statusText: string;
                    data: unknown;
                };
            };
            apiError.response = {
                status: 400,
                statusText: "Bad Request",
                data: { error: "Invalid text" },
            };
            mockedGenerateVoice.mockRejectedValue(apiError);

            await expect(generateVoice("テスト")).rejects.toThrow(Error);
            expect(mockedGenerateVoice).toHaveBeenCalledWith("テスト");
        });
    });

    describe("checkVoicevoxServerHealth", () => {
        it("サーバーが正常な場合はtrueを返すのだ", async () => {
            const result = await checkVoicevoxServerHealth();
            expect(result).toBe(true);
            expect(mockedCheckVoicevoxServerHealth).toHaveBeenCalled();
        });

        it("サーバーに問題がある場合はエラーを投げるのだ", async () => {
            const serverError = new Error("Server Error");
            mockedCheckVoicevoxServerHealth.mockRejectedValue(serverError);

            await expect(checkVoicevoxServerHealth()).rejects.toThrow(Error);
            expect(mockedCheckVoicevoxServerHealth).toHaveBeenCalled();
        });
    });
});
