import { getVoiceConnection } from "@discordjs/voice";
import type { Guild, GuildMember } from "discord.js";
import { Collection, type Message, TextChannel } from "discord.js";
import { type Mock, type MockedObject, beforeEach, describe, expect, it, vi } from "vitest";
import { playAudio } from "../utils/audio";
import { generateVoice } from "../utils/voicevox";
import {
	disableTextToSpeech,
	enableTextToSpeech,
	handleMessage,
	isTextToSpeechEnabled,
} from "./textToSpeech";

// モックの設定
vi.mock("@discordjs/voice");
vi.mock("../utils/voicevox");
vi.mock("../utils/audio");

describe("textToSpeech", () => {
	let mockMessage: MockedObject<Message>;
	let mockGuild: MockedObject<Guild>;
	let mockChannel: MockedObject<TextChannel>;
	let mockMember: MockedObject<GuildMember>;

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
		} as MockedObject<Guild>;

		mockChannel = Object.assign(Object.create(TextChannel.prototype), {
			id: "channel-123",
			send: vi.fn(),
			type: "GUILD_TEXT",
			isTextBased: () => true,
		}) as MockedObject<TextChannel>;

		mockMember = {
			displayName: "テストユーザー",
		} as MockedObject<GuildMember>;

		mockMessage = {
			author: {
				bot: false,
				id: "user-123",
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
		} as unknown as MockedObject<Message>;

		// モックの設定
		(mockGuild.members.cache as Map<string, GuildMember>).set("user-123", mockMember);
		(mockGuild.channels.cache as Map<string, TextChannel>).set("channel-123", mockChannel);

		// モックのリセット
		vi.clearAllMocks();
		disableTextToSpeech("guild-123");
	});

	describe("isTextToSpeechEnabled", () => {
		it("有効化されているチャンネルを正しく判定できるのだ", () => {
			enableTextToSpeech("guild-123", "channel-123");
			expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(true);
		});

		it("無効化されているチャンネルを正しく判定できるのだ", () => {
			expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(false);
		});
	});

	describe("enableTextToSpeech", () => {
		it("チャンネルを有効化できるのだ", () => {
			enableTextToSpeech("guild-123", "channel-123");
			expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(true);
		});
	});

	describe("disableTextToSpeech", () => {
		it("チャンネルを無効化できるのだ", () => {
			enableTextToSpeech("guild-123", "channel-123");
			disableTextToSpeech("guild-123");
			expect(isTextToSpeechEnabled("guild-123", "channel-123")).toBe(false);
		});
	});

	describe("handleMessage", () => {
		const mockConnection = {
			state: {
				status: "ready",
			},
		};

		beforeEach(() => {
			(getVoiceConnection as Mock).mockReturnValue(mockConnection);
			(generateVoice as Mock).mockResolvedValue(Buffer.from("test"));
			(playAudio as Mock).mockResolvedValue(undefined);
		});

		it("有効化されているチャンネルでメッセージを処理できるのだ", async () => {
			enableTextToSpeech("guild-123", "channel-123");
			await handleMessage(mockMessage);

			expect(generateVoice).toHaveBeenCalledWith("テストメッセージ", "guild-123", "user-123");
			expect(playAudio).toHaveBeenCalledWith(mockConnection, expect.any(Buffer));
		});

		it("ボットのメッセージは無視するのだ", async () => {
			enableTextToSpeech("guild-123", "channel-123");
			const botMessage = {
				...mockMessage,
				author: {
					bot: true,
				},
			} as MockedObject<Message>;
			await handleMessage(botMessage);

			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("DMは無視するのだ", async () => {
			enableTextToSpeech("guild-123", "channel-123");
			const dmMessage = {
				...mockMessage,
				guild: null,
			} as MockedObject<Message>;
			await handleMessage(dmMessage);

			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("有効化されていないチャンネルは無視するのだ", async () => {
			await handleMessage(mockMessage);

			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("ボイスコネクションがない場合は無視するのだ", async () => {
			enableTextToSpeech("guild-123", "channel-123");
			(getVoiceConnection as Mock).mockReturnValue(null);
			await handleMessage(mockMessage);

			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("エラーが発生した場合はエラーメッセージを送信するのだ", async () => {
			enableTextToSpeech("guild-123", "channel-123");
			const testError = new Error("テストエラー");
			(generateVoice as Mock).mockRejectedValue(testError);
			await handleMessage(mockMessage);

			expect(mockChannel.send).toHaveBeenCalledWith(
				`メッセージの読み上げに失敗したのだ: ${testError.message}`,
			);
		});
	});
});
