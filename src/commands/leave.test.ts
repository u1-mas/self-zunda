import { type VoiceConnection, getVoiceConnection } from "@discordjs/voice";
import type { ChatInputCommandInteraction } from "discord.js";
import { type MockedFunction, vi } from "vitest";
import { disableTextToSpeech } from "../models/activeChannels.ts";
import { leave } from "./leave.ts";

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

describe("leave command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("コマンドの名前と説明が正しく設定されているのだ", () => {
		expect(leave.data.name).toBe("leave");
		expect(leave.data.description).toBe("ボイスチャンネルから退出するのだ");
	});

	test("サーバー外で実行した場合はエラーを返すのだ", async () => {
		const mockInteraction = createMockInteraction();

		await leave.execute(mockInteraction);

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

		await leave.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "ボイスチャンネルに参加していないのだ！",
			ephemeral: true,
		});
	});

	test("正常に退出できた場合は成功メッセージを返すのだ", async () => {
		const mockGuild = {
			id: "789",
			name: "テストサーバー",
		};

		const mockConnection = {
			destroy: vi.fn(),
		} as unknown as VoiceConnection;

		const mockInteraction = createMockInteraction({
			guild: mockGuild,
		});

		(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(
			mockConnection,
		);

		await leave.execute(mockInteraction);

		expect(mockConnection.destroy).toHaveBeenCalled();
		expect(disableTextToSpeech).toHaveBeenCalledWith(mockGuild.id);
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "ボイスチャンネルから退出したのだ！",
			ephemeral: true,
		});
	});
});
