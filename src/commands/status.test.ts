import { getVoiceConnection } from "@discordjs/voice";
import type { VoiceConnection } from "@discordjs/voice";
import type { ChatInputCommandInteraction } from "discord.js";
import { type MockedFunction, vi } from "vitest";
import { getActiveChannels } from "../models/activeChannels.ts";
import { status } from "./status.ts";

vi.mock("@discordjs/voice");
vi.mock("../models/activeChannels");

// モックインタラクションビルダー
const createMockInteraction = (overrides = {}) => {
	return {
		guild: null,
		reply: vi.fn().mockResolvedValue(undefined),
		...overrides,
	} as unknown as ChatInputCommandInteraction;
};

describe("status command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("コマンドの名前と説明が正しく設定されているのだ", () => {
		expect(status.data.name).toBe("status");
		expect(status.data.description).toBe("現在の読み上げ状態を確認するのだ");
	});

	test("サーバー外で実行した場合はエラーを返すのだ", async () => {
		const mockInteraction = createMockInteraction();

		await status.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "このコマンドはサーバー内でのみ使用できるのだ！",
			ephemeral: true,
		});
	});

	test("ボイス接続がない場合はエラーを返すのだ", async () => {
		const mockGuild = {
			id: "789",
		};

		const mockInteraction = createMockInteraction({
			guild: mockGuild,
		});

		(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(undefined);
		(getActiveChannels as MockedFunction<typeof getActiveChannels>).mockReturnValue(new Map());

		await status.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "現在、ボイスチャンネルに接続していないのだ！",
			ephemeral: true,
		});
	});

	test("正常に状態を表示できるのだ", async () => {
		const mockGuild = {
			id: "789",
		};

		const mockConnection = {
			destroy: vi.fn(),
		};

		const activeTextChannelId = "012";
		const activeChannelsMap = new Map();
		activeChannelsMap.set(mockGuild.id, activeTextChannelId);

		const mockInteraction = createMockInteraction({
			guild: mockGuild,
		});

		(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(
			mockConnection as unknown as VoiceConnection,
		);
		(getActiveChannels as MockedFunction<typeof getActiveChannels>).mockReturnValue(
			activeChannelsMap,
		);

		await status.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: `現在、<#${activeTextChannelId}> の内容を読み上げているのだ！\n読み上げ設定を変更するには \`/settings\` コマンドを使用するのだ！`,
			ephemeral: true,
		});
	});
});
