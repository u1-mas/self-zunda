import { getVoiceConnection } from "@discordjs/voice";
import type { Guild, GuildMember } from "discord.js";
import { Collection, type Message, TextChannel } from "discord.js";
import { type Mock, type MockedObject, beforeEach, describe, expect, it, vi } from "vitest";
import { isTextToSpeechEnabled } from "../models/activeChannels.ts";
import { playAudio } from "../utils/audio.ts";
import { generateVoice } from "../utils/voicevox.ts";
import { handleMessage } from "./textToSpeech.ts";

// モックの設定
vi.mock("@discordjs/voice");
vi.mock("../utils/voicevox");
vi.mock("../utils/audio");
vi.mock("../models/activeChannels");
vi.mock("../utils/messageFormatter", () => ({
	formatMessage: vi.fn().mockImplementation((message) => message.content),
}));

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
				tag: "テストユーザー#1234",
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

		// isTextToSpeechEnabledのモック
		(isTextToSpeechEnabled as Mock).mockImplementation((guildId, channelId) => {
			return guildId === "guild-123" && channelId === "channel-123" && mockIsEnabled;
		});

		// モックのリセット
		vi.clearAllMocks();
		mockIsEnabled = false;
	});

	// テスト用の状態
	let mockIsEnabled = false;

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
			mockIsEnabled = true;
			await handleMessage(mockMessage);

			expect(generateVoice).toHaveBeenCalledWith("テストメッセージ", "guild-123", "user-123");
			expect(playAudio).toHaveBeenCalledWith(mockConnection, expect.any(Buffer));
		});

		it("ボットのメッセージは無視するのだ", async () => {
			mockIsEnabled = true;
			const botMessage = {
				...mockMessage,
				author: {
					bot: true,
					id: "user-123",
					tag: "bot#1234",
				},
			} as MockedObject<Message>;

			await expect(handleMessage(botMessage)).resolves.toBeUndefined();
			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("DMは無視するのだ", async () => {
			mockIsEnabled = true;
			const dmMessage = {
				...mockMessage,
				guild: null,
			} as MockedObject<Message>;

			await expect(handleMessage(dmMessage)).resolves.toBeUndefined();
			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("有効化されていないチャンネルは無視するのだ", async () => {
			mockIsEnabled = false;

			await expect(handleMessage(mockMessage)).resolves.toBeUndefined();
			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("ボイスコネクションがない場合は無視するのだ", async () => {
			mockIsEnabled = true;
			(getVoiceConnection as Mock).mockReturnValue(null);

			await expect(handleMessage(mockMessage)).resolves.toBeUndefined();
			expect(generateVoice).not.toHaveBeenCalled();
		});

		it("エラーが発生した場合は処理されるのだ", async () => {
			mockIsEnabled = true;
			const testError = new Error("テストエラー");
			(generateVoice as Mock).mockRejectedValue(testError);

			await expect(handleMessage(mockMessage)).resolves.toBeUndefined();
			expect(mockChannel.send).toHaveBeenCalled();
		});
	});
});
