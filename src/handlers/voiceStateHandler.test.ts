import { getVoiceConnection } from "@discordjs/voice";
import type { Guild, GuildMember, User, VoiceState } from "discord.js";
import { error } from "../utils/logger";
import { handleVoiceStateUpdate } from "./voiceStateHandler";
import { generateVoice } from "../utils/voicevox";
import { playAudio } from "../utils/audio";

// モック
vi.mock("@discordjs/voice", () => ({
	getVoiceConnection: vi.fn(),
}));

vi.mock("../utils/logger", () => ({
	warn: vi.fn(),
	error: vi.fn(),
	log: vi.fn(),
	info: vi.fn(),
	debug: vi.fn(),
}));

vi.mock("../utils/voicevox", () => ({
	generateVoice: vi.fn(),
}));

vi.mock("../utils/audio", () => ({
	playAudio: vi.fn(),
}));

// モック用の型定義
interface MockConnection {
	destroy: ReturnType<typeof vi.fn>;
	rejoin: ReturnType<typeof vi.fn>;
}

describe("voiceStateHandler", () => {
	// モック
	const mockGuildId = "123456789";
	const mockUserId = "987654321";
	let mockOldState: VoiceState;
	let mockNewState: VoiceState;
	let mockConnection: MockConnection;

	beforeEach(() => {
		vi.resetAllMocks();

		// コネクションのモック
		mockConnection = {
			destroy: vi.fn(),
			rejoin: vi.fn(),
		};

		// Guild、Member、Userのモック
		const mockGuild = { id: mockGuildId } as unknown as Guild;
		const mockUser = { bot: false } as unknown as User;
		const mockMember = {
			id: mockUserId,
			user: mockUser,
			displayName: "テストユーザー",
		} as unknown as GuildMember;

		// VoiceStateのモックを作成
		mockOldState = {
			guild: mockGuild,
			member: mockMember,
			channelId: "oldChannelId",
			channel: { id: "oldChannelId" } as any,
			valueOf: () => ({}),
		} as unknown as VoiceState;

		mockNewState = {
			guild: mockGuild,
			member: mockMember,
			channelId: "newChannelId",
			channel: { id: "newChannelId" } as any,
			valueOf: () => ({}),
		} as unknown as VoiceState;

		(getVoiceConnection as ReturnType<typeof vi.fn>).mockReturnValue(mockConnection);
		(generateVoice as ReturnType<typeof vi.fn>).mockResolvedValue(Buffer.from("test"));
		(playAudio as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
	});

	it("ボットユーザーのボイスステート変更は無視されること", async () => {
		// ボットユーザーに設定
		const botUser = { bot: true } as unknown as User;
		const botMember = {
			...mockOldState.member,
			user: botUser,
		} as unknown as GuildMember;

		const botState = {
			...mockNewState,
			member: botMember,
		} as VoiceState;

		await handleVoiceStateUpdate(mockOldState, botState);

		expect(getVoiceConnection).not.toHaveBeenCalled();
		expect(generateVoice).not.toHaveBeenCalled();
	});

	it("コネクションがない場合は何もしないこと", async () => {
		// コネクションがない状態に設定
		(getVoiceConnection as ReturnType<typeof vi.fn>).mockReturnValue(null);

		await handleVoiceStateUpdate(mockOldState, mockNewState);

		expect(generateVoice).not.toHaveBeenCalled();
		expect(playAudio).not.toHaveBeenCalled();
	});

	it("ユーザーがチャンネルに参加した場合は参加メッセージを読み上げること", async () => {
		// 参加シナリオ：古いステートはチャンネルなし、新しいステートはチャンネルあり
		const joinOldState = {
			...mockOldState,
			channelId: null,
			channel: null,
		} as unknown as VoiceState;

		await handleVoiceStateUpdate(joinOldState, mockNewState);

		expect(generateVoice).toHaveBeenCalledWith(expect.stringContaining("参加"));
		expect(playAudio).toHaveBeenCalled();
	});

	it("ユーザーがチャンネルから退出した場合は退出メッセージを読み上げること", async () => {
		// 退出シナリオ：古いステートはチャンネルあり、新しいステートはチャンネルなし
		const leaveNewState = {
			...mockNewState,
			channelId: null,
			channel: null,
		} as unknown as VoiceState;

		await handleVoiceStateUpdate(mockOldState, leaveNewState);

		expect(generateVoice).toHaveBeenCalledWith(expect.stringContaining("抜けた"));
		expect(playAudio).toHaveBeenCalled();
	});

	it("エラーが発生した場合はエラーログを出力すること", async () => {
		// エラーを発生させる
		const testError = new Error("テストエラー");
		(generateVoice as ReturnType<typeof vi.fn>).mockRejectedValue(testError);

		await handleVoiceStateUpdate(mockOldState, mockNewState);

		expect(error).toHaveBeenCalledWith(
			expect.stringContaining("ボイスチャンネルの状態変更の読み上げに失敗"),
			testError,
		);
	});
});
