import type { VoiceState } from "discord.js";
import { handleVoiceStateUpdate } from "./voiceStateHandler";
import { getVoiceConnection } from "@discordjs/voice";
import { warn } from "../utils/logger";

// モック
vi.mock("@discordjs/voice", () => ({
	getVoiceConnection: vi.fn(),
	entersState: vi.fn(),
	VoiceConnectionStatus: {
		Disconnected: "disconnected",
		Destroyed: "destroyed",
	},
}));

vi.mock("../utils/logger", () => ({
	warn: vi.fn(),
	error: vi.fn(),
}));

describe("voiceStateHandler", () => {
	// モック
	const mockGuildId = "123456789";
	const mockUserId = "987654321";
	const mockClientId = "111222333";
	let mockOldState: Partial<VoiceState>;
	let mockNewState: Partial<VoiceState>;
	let mockConnection: any;
	let mockDestroy: any;

	beforeEach(() => {
		vi.resetAllMocks();

		// デストロイ関数のモック
		mockDestroy = vi.fn();

		// コネクションのモック
		mockConnection = {
			destroy: mockDestroy,
			rejoin: vi.fn(),
		};

		// voiceStateのモック
		mockOldState = {
			guild: { id: mockGuildId },
			member: { id: mockUserId },
			channel: { id: "oldChannelId" },
		} as unknown as Partial<VoiceState>;

		mockNewState = {
			guild: { id: mockGuildId },
			member: { id: mockUserId },
			channel: { id: "newChannelId" },
		} as unknown as Partial<VoiceState>;

		// クライアントのモック
		mockOldState.client = { user: { id: mockClientId } } as any;
		mockNewState.client = { user: { id: mockClientId } } as any;

		(getVoiceConnection as ReturnType<typeof vi.fn>).mockReturnValue(mockConnection);
	});

	it("ボットユーザー自身のボイスステート変更は無視されること", async () => {
		// ボットユーザー自身のステート変更に設定
		mockOldState.member = { id: mockClientId } as any;
		mockNewState.member = { id: mockClientId } as any;

		await handleVoiceStateUpdate(mockOldState as VoiceState, mockNewState as VoiceState);

		expect(getVoiceConnection).not.toHaveBeenCalled();
	});

	it("コネクションがない場合は何もしないこと", async () => {
		// コネクションがない状態に設定
		(getVoiceConnection as ReturnType<typeof vi.fn>).mockReturnValue(null);

		await handleVoiceStateUpdate(mockOldState as VoiceState, mockNewState as VoiceState);

		expect(warn).not.toHaveBeenCalled();
	});

	it("移動先のチャンネルがnullの場合は切断すること", async () => {
		// チャンネルから退出した状態に設定
		mockNewState.channel = null;

		await handleVoiceStateUpdate(mockOldState as VoiceState, mockNewState as VoiceState);

		expect(mockDestroy).toHaveBeenCalled();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining("切断"));
	});

	it("同じボイスチャンネルへの移動は無視されること", async () => {
		// 同じチャンネルに移動した状態に設定
		mockOldState.channel = { id: "sameChannelId" } as any;
		mockNewState.channel = { id: "sameChannelId" } as any;

		await handleVoiceStateUpdate(mockOldState as VoiceState, mockNewState as VoiceState);

		expect(mockConnection.destroy).not.toHaveBeenCalled();
		expect(mockConnection.rejoin).not.toHaveBeenCalled();
	});

	it("異なるボイスチャンネルへの移動はrejoinを呼び出すこと", async () => {
		await handleVoiceStateUpdate(mockOldState as VoiceState, mockNewState as VoiceState);

		expect(mockConnection.rejoin).toHaveBeenCalled();
		expect(warn).toHaveBeenCalledWith(expect.stringContaining("移動"));
	});
});
