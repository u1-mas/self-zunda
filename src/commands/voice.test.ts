import {
	type AudioPlayer,
	type VoiceConnection,
	VoiceConnectionStatus,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
} from "@discordjs/voice";
import type {
	BaseMessageOptions,
	ChatInputCommandInteraction,
	VoiceBasedChannel,
} from "discord.js";
import { type MockedFunction, vi } from "vitest";
import { disableTextToSpeech, enableTextToSpeech } from "../models/activeChannels";
import { voice } from "./voice";

vi.mock("@discordjs/voice");
vi.mock("../models/activeChannels");

// モックインタラクションビルダー
const createMockInteraction = (overrides = {}) => {
	return {
		guild: null,
		reply: vi.fn().mockResolvedValue(undefined),
		options: {
			getSubcommand: vi.fn().mockReturnValue(""),
		},
		...overrides,
	} as unknown as ChatInputCommandInteraction;
};

describe("voice command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("コマンドの名前と説明が正しく設定されているのだ", () => {
		expect(voice.data.name).toBe("voice");
		expect(voice.data.description).toBe("ボイスチャンネル関連の操作を行うのだ");
	});

	describe("join サブコマンド", () => {
		test("サーバー外で実行した場合はエラーを返すのだ", async () => {
			const mockInteraction = createMockInteraction({
				options: {
					getSubcommand: vi.fn().mockReturnValue("join"),
				},
			});

			await voice.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
		});

		test("メンバー情報が取得できない場合はエラーを返すのだ", async () => {
			const mockInteraction = createMockInteraction({
				guild: {
					members: {
						cache: {
							get: vi.fn().mockReturnValue(null),
						},
					},
				},
				user: {
					id: "123",
				},
				options: {
					getSubcommand: vi.fn().mockReturnValue("join"),
				},
			});

			await voice.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "メンバー情報が取得できなかったのだ...",
				ephemeral: true,
			});
		});

		test("ボイスチャンネルに参加していない場合はエラーを返すのだ", async () => {
			const mockInteraction = createMockInteraction({
				guild: {
					members: {
						cache: {
							get: vi.fn().mockReturnValue({
								voice: {
									channel: null,
								},
							}),
						},
					},
				},
				user: {
					id: "123",
				},
				options: {
					getSubcommand: vi.fn().mockReturnValue("join"),
				},
			});

			await voice.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "先にボイスチャンネルに参加してほしいのだ！",
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

			const mockAudioPlayer = {
				subscribers: [],
				behaviors: {},
				playable: true,
				unsubscribe: vi.fn(),
				subscribe: vi.fn(),
				on: vi.fn(),
				once: vi.fn(),
				removeListener: vi.fn(),
				removeAllListeners: vi.fn(),
				setMaxListeners: vi.fn(),
				getMaxListeners: vi.fn(),
				listeners: vi.fn(),
				rawListeners: vi.fn(),
				emit: vi.fn(),
				listenerCount: vi.fn(),
				prependListener: vi.fn(),
				prependOnceListener: vi.fn(),
				eventNames: vi.fn(),
			} as unknown as AudioPlayer;

			const mockGuild = {
				id: "789",
				members: {
					cache: {
						get: vi.fn().mockReturnValue({
							voice: {
								channel: mockVoiceChannel,
							},
						}),
					},
				},
				voiceAdapterCreator: {},
			};

			const mockChannel = {
				id: "012",
			};

			const mockInteraction = createMockInteraction({
				guild: mockGuild,
				user: {
					id: "123",
				},
				channel: mockChannel,
				options: {
					getSubcommand: vi.fn().mockReturnValue("join"),
				},
			});

			(joinVoiceChannel as MockedFunction<typeof joinVoiceChannel>).mockReturnValue(mockConnection);
			(entersState as unknown as MockedFunction<typeof entersState>).mockResolvedValue(
				mockAudioPlayer,
			);

			await voice.execute(mockInteraction);

			expect(joinVoiceChannel).toHaveBeenCalledWith({
				channelId: mockVoiceChannel.id,
				guildId: mockGuild.id,
				adapterCreator: mockGuild.voiceAdapterCreator,
			});
			expect(enableTextToSpeech).toHaveBeenCalledWith(mockGuild.id, mockChannel.id);
			expect(mockInteraction.reply).toHaveBeenCalledWith(
				expect.objectContaining({
					content: expect.stringContaining(mockVoiceChannel.name),
					ephemeral: true,
				}),
			);
		});
	});

	describe("leave サブコマンド", () => {
		test("サーバー外で実行した場合はエラーを返すのだ", async () => {
			const mockInteraction = createMockInteraction({
				options: {
					getSubcommand: vi.fn().mockReturnValue("leave"),
				},
			});

			await voice.execute(mockInteraction);

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
				options: {
					getSubcommand: vi.fn().mockReturnValue("leave"),
				},
			});

			(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(undefined);

			await voice.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "ボイスチャンネルに参加していないのだ！",
				ephemeral: true,
			});
		});

		test("正常に退出できた場合は成功メッセージを返すのだ", async () => {
			const mockGuild = {
				id: "789",
			};

			const mockConnection = {
				destroy: vi.fn(),
			} as unknown as VoiceConnection;

			const mockInteraction = createMockInteraction({
				guild: mockGuild,
				options: {
					getSubcommand: vi.fn().mockReturnValue("leave"),
				},
			});

			(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(
				mockConnection,
			);

			await voice.execute(mockInteraction);

			expect(mockConnection.destroy).toHaveBeenCalled();
			expect(disableTextToSpeech).toHaveBeenCalledWith(mockGuild.id);
			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "ボイスチャンネルから退出したのだ！",
				ephemeral: true,
			});
		});
	});

	describe("status サブコマンド", () => {
		test("正常に状態を表示できるのだ", async () => {
			const mockGuild = {
				id: "789",
			};

			const mockInteraction = createMockInteraction({
				guild: mockGuild,
				options: {
					getSubcommand: vi.fn().mockReturnValue("status"),
				},
			});

			await voice.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalled();
		});
	});
});
