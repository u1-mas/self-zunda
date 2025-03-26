import { type VoiceConnection, VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";
import type { ChatInputCommandInteraction, VoiceBasedChannel } from "discord.js";
import { type MockedFunction, vi } from "vitest";
import { enableTextToSpeech } from "../models/activeChannels.ts";
import { join } from "./join.ts";

vi.mock("@discordjs/voice");
vi.mock("../models/activeChannels");
vi.mock("../utils/voicevox", () => ({
	checkVoicevoxServerHealth: vi.fn().mockResolvedValue(true),
}));

// モックインタラクションビルダー
const createMockInteraction = (overrides = {}) => {
	return {
		guild: null,
		reply: vi.fn().mockResolvedValue(undefined),
		options: {
			getChannel: vi.fn().mockReturnValue(null),
		},
		...overrides,
	} as unknown as ChatInputCommandInteraction;
};

describe("join command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("コマンドの名前と説明が正しく設定されているのだ", () => {
		expect(join.data.name).toBe("join");
		expect(join.data.description).toBe("ボイスチャンネルに参加して読み上げを開始するのだ");
	});

	test("サーバー外で実行した場合はエラーを返すのだ", async () => {
		const mockInteraction = createMockInteraction();

		await join.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "このコマンドはサーバー内でのみ使用できるのだ！",
			ephemeral: true,
		});
	});

	test("ボイスチャンネルに参加していない場合はエラーを返すのだ", async () => {
		const mockInteraction = createMockInteraction({
			guild: {
				id: "789",
			},
			member: {
				voice: {
					channel: null,
				},
			},
		});

		await join.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content:
				"ボイスチャンネルを指定するか、ボイスチャンネルに参加してからコマンドを実行するのだ！",
			ephemeral: true,
		});
	});

	test("ボイスチャンネルに正常に参加できた場合は成功メッセージを返すのだ", async () => {
		const mockVoiceChannel = {
			id: "456",
			name: "テストチャンネル",
		} as unknown as VoiceBasedChannel;

		const mockConnection = {
			status: VoiceConnectionStatus.Ready,
			destroy: vi.fn(),
			on: vi.fn(),
			rejoinAttempts: 0,
			_state: { status: VoiceConnectionStatus.Ready },
			joinConfig: {},
			state: { status: VoiceConnectionStatus.Ready },
			subscribe: vi.fn(),
			unsubscribe: vi.fn(),
		} as unknown as VoiceConnection;

		const mockGuild = {
			id: "789",
			name: "テストサーバー",
			voiceAdapterCreator: {},
		};

		const mockChannel = {
			id: "012",
		};

		const mockInteraction = createMockInteraction({
			guild: mockGuild,
			channel: mockChannel,
			member: {
				voice: {
					channel: mockVoiceChannel,
				},
			},
		});

		(joinVoiceChannel as MockedFunction<typeof joinVoiceChannel>).mockReturnValue(mockConnection);

		await join.execute(mockInteraction);

		expect(joinVoiceChannel).toHaveBeenCalledWith({
			channelId: mockVoiceChannel.id,
			guildId: mockGuild.id,
			adapterCreator: mockGuild.voiceAdapterCreator,
		});
		expect(enableTextToSpeech).toHaveBeenCalledWith(mockGuild.id, mockChannel.id);
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: `<#${mockVoiceChannel.id}> に参加して、このテキストチャンネルの内容を読み上げるのだ！`,
			ephemeral: true,
		});
	});
});
