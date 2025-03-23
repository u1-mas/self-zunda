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
import { disableTextToSpeech, enableTextToSpeech } from "../features/textToSpeech";
import { join, leave } from "./voice";

vi.mock("@discordjs/voice");
vi.mock("../features/textToSpeech");

describe("voice commands", () => {
	describe("join command", () => {
		test("コマンドの名前と説明が正しく設定されているのだ", () => {
			expect(join.data.name).toBe("join");
			expect(join.data.description).toBe("ボイスチャンネルに参加して読み上げを開始するのだ");
		});

		test("サーバー外で実行した場合はエラーを返すのだ", async () => {
			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
				guild: null,
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			await join.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
		});

		test("メンバー情報が取得できない場合はエラーを返すのだ", async () => {
			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
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
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			await join.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "メンバー情報が取得できなかったのだ...",
				ephemeral: true,
			});
		});

		test("ボイスチャンネルに参加していない場合はエラーを返すのだ", async () => {
			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
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
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			await join.execute(mockInteraction);

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

			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
				guild: mockGuild,
				user: {
					id: "123",
				},
				channel: mockChannel,
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			(joinVoiceChannel as MockedFunction<typeof joinVoiceChannel>).mockReturnValue(mockConnection);
			(entersState as unknown as MockedFunction<typeof entersState>).mockResolvedValue(
				mockAudioPlayer,
			);

			await join.execute(mockInteraction);

			expect(joinVoiceChannel).toHaveBeenCalledWith({
				channelId: mockVoiceChannel.id,
				guildId: mockGuild.id,
				adapterCreator: mockGuild.voiceAdapterCreator,
			});
			expect(enableTextToSpeech).toHaveBeenCalledWith(mockGuild.id, mockChannel.id);
			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: `${mockVoiceChannel.name}に参加して、このチャンネルの読み上げを開始したのだ！`,
				ephemeral: true,
			});
		});
	});

	describe("leave command", () => {
		test("コマンドの名前と説明が正しく設定されているのだ", () => {
			expect(leave.data.name).toBe("leave");
			expect(leave.data.description).toBe("ボイスチャンネルから離れて読み上げを停止するのだ");
		});

		test("サーバー外で実行した場合はエラーを返すのだ", async () => {
			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
				guild: null,
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			await leave.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "このコマンドはサーバー内でのみ使用できるのだ！",
				ephemeral: true,
			});
		});

		test("ボイスチャンネルに参加していない場合はエラーを返すのだ", async () => {
			const mockGuild = {
				id: "789",
			};

			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
				guild: mockGuild,
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(undefined);

			await leave.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "ぼくはボイスチャンネルにいないのだ！",
				ephemeral: true,
			});
		});

		test("ボイスチャンネルから正常に退出できた場合は成功メッセージを返すのだ", async () => {
			const mockConnection = {
				destroy: vi.fn(),
				status: VoiceConnectionStatus.Ready,
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
			};

			const mockReply = vi.fn() as MockedFunction<(options: BaseMessageOptions) => Promise<void>>;
			mockReply.mockResolvedValue();

			const mockInteraction = {
				guild: mockGuild,
				reply: mockReply,
			} as unknown as ChatInputCommandInteraction;

			(getVoiceConnection as MockedFunction<typeof getVoiceConnection>).mockReturnValue(
				mockConnection,
			);

			await leave.execute(mockInteraction);

			expect(disableTextToSpeech).toHaveBeenCalledWith(mockGuild.id);
			expect(mockConnection.destroy).toHaveBeenCalled();
			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: "ボイスチャンネルから離れて、読み上げを停止したのだ！",
				ephemeral: true,
			});
		});
	});
});
