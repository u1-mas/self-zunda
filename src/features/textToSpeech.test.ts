import { getVoiceConnection } from "@discordjs/voice";
import type { Guild, GuildMember } from "discord.js";
import { Collection, type Message, TextChannel } from "discord.js";
import { playAudio } from "../utils/audio";
import { generateVoice } from "../utils/voicevox";
import {
    disableTextToSpeech,
    enableTextToSpeech,
    handleMessage,
    isTextToSpeechEnabled,
} from "./textToSpeech";

// モックの設定
jest.mock("@discordjs/voice");
jest.mock("../utils/voicevox");
jest.mock("../utils/audio");

describe("textToSpeech", () => {
    let mockMessage: jest.Mocked<Message>;
    let mockGuild: jest.Mocked<Guild>;
    let mockChannel: jest.Mocked<TextChannel>;
    let mockMember: jest.Mocked<GuildMember>;

    beforeEach(() => {
        // モックの初期化
        mockGuild = {
            id: "guild-123",
            members: {
                cache: new Map(),
            },
            channels: {
                cache: new Map(),
            },
        } as jest.Mocked<Guild>;

        mockChannel = Object.assign(Object.create(TextChannel.prototype), {
            id: "channel-123",
            send: jest.fn(),
            type: "GUILD_TEXT",
            isTextBased: () => true,
        }) as jest.Mocked<TextChannel>;

        mockMember = {
            displayName: "テストユーザー",
        } as jest.Mocked<GuildMember>;

        mockMessage = {
            author: {
                bot: false,
            },
            guild: mockGuild,
            channel: mockChannel,
            content: "テストメッセージ",
            attachments: new Collection(),
            embeds: [],
            components: [],
            reactions: new Collection(),
            mentions: {
                users: new Collection(),
                roles: new Collection(),
                channels: new Collection(),
            },
            member: mockMember,
            client: {
                user: {
                    id: "bot-123",
                },
            },
        } as unknown as jest.Mocked<Message>;

        // モックの設定
        (mockGuild.members.cache as Map<string, GuildMember>).set(
            "user-123",
            mockMember,
        );
        (mockGuild.channels.cache as Map<string, TextChannel>).set(
            "channel-123",
            mockChannel,
        );

        // モックのリセット
        jest.clearAllMocks();
        disableTextToSpeech("guild-123");
    });

    describe("isTextToSpeechEnabled", () => {
        it("有効化されているチャンネルを正しく判定できるのだ", () => {
            enableTextToSpeech("guild-123", "channel-123");
            expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(
                true,
            );
        });

        it("無効化されているチャンネルを正しく判定できるのだ", () => {
            expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(
                false,
            );
        });
    });

    describe("enableTextToSpeech", () => {
        it("チャンネルを有効化できるのだ", () => {
            enableTextToSpeech("guild-123", "channel-123");
            expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(
                true,
            );
        });
    });

    describe("disableTextToSpeech", () => {
        it("チャンネルを無効化できるのだ", () => {
            enableTextToSpeech("guild-123", "channel-123");
            disableTextToSpeech("guild-123");
            expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(
                false,
            );
        });
    });

    describe("handleMessage", () => {
        const mockConnection = {
            state: {
                status: "ready",
            },
        };

        beforeEach(() => {
            (getVoiceConnection as jest.Mock).mockReturnValue(mockConnection);
            (generateVoice as jest.Mock).mockResolvedValue(Buffer.from("test"));
            (playAudio as jest.Mock).mockResolvedValue(undefined);
        });

        it("有効化されているチャンネルでメッセージを処理できるのだ", async () => {
            enableTextToSpeech("guild-123", "channel-123");
            await handleMessage(mockMessage);

            expect(generateVoice).toHaveBeenCalledWith("テストメッセージ");
            expect(playAudio).toHaveBeenCalledWith(
                mockConnection,
                expect.any(Buffer),
            );
        });

        it("ボットのメッセージは無視するのだ", async () => {
            enableTextToSpeech("guild-123", "channel-123");
            const botMessage = {
                ...mockMessage,
                author: {
                    bot: true,
                },
            } as jest.Mocked<Message>;
            await handleMessage(botMessage);

            expect(generateVoice).not.toHaveBeenCalled();
        });

        it("DMは無視するのだ", async () => {
            enableTextToSpeech("guild-123", "channel-123");
            const dmMessage = {
                ...mockMessage,
                guild: null,
            } as jest.Mocked<Message>;
            await handleMessage(dmMessage);

            expect(generateVoice).not.toHaveBeenCalled();
        });

        it("有効化されていないチャンネルは無視するのだ", async () => {
            await handleMessage(mockMessage);

            expect(generateVoice).not.toHaveBeenCalled();
        });

        it("ボイスコネクションがない場合は無視するのだ", async () => {
            enableTextToSpeech("guild-123", "channel-123");
            (getVoiceConnection as jest.Mock).mockReturnValue(null);
            await handleMessage(mockMessage);

            expect(generateVoice).not.toHaveBeenCalled();
        });

        it("エラーが発生した場合はエラーメッセージを送信するのだ", async () => {
            enableTextToSpeech("guild-123", "channel-123");
            const testError = new Error("テストエラー");
            (generateVoice as jest.Mock).mockRejectedValue(testError);
            await handleMessage(mockMessage);

            expect(mockChannel.send).toHaveBeenCalledWith(
                `メッセージの読み上げに失敗したのだ: ${testError.message}`,
            );
        });
    });
});
