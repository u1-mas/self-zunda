import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import { error } from "../utils/logger";
import { commands } from "./commands";
import { handleInteraction } from "./interactionHandler";

// モック
vi.mock("../utils/logger", () => ({
	error: vi.fn(),
}));

vi.mock("./commands", () => ({
	commands: {
		get: vi.fn(),
	},
}));

// DiscordAPIErrorのモック
class MockDiscordAPIError extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.name = "DiscordAPIError";
		this.code = code;
	}
}

// モックインタラクションビルダー
const createMockInteraction = (overrides = {}) => {
	return {
		isChatInputCommand: () => true,
		commandName: "testCommand",
		replied: false,
		deferred: false,
		reply: vi.fn().mockResolvedValue(undefined),
		followUp: vi.fn().mockResolvedValue(undefined),
		...overrides,
	} as unknown as ChatInputCommandInteraction;
};

describe("interactionHandler", () => {
	// モックを準備
	const mockExecute = vi.fn();
	const mockCommandName = "testCommand";
	let mockInteraction: ChatInputCommandInteraction;

	beforeEach(() => {
		vi.resetAllMocks();

		// モックインタラクションを作成
		mockInteraction = createMockInteraction();

		// commandsのgetモックを設定
		(commands.get as ReturnType<typeof vi.fn>).mockReturnValue({
			execute: mockExecute,
		});
	});

	it("チャットコマンドでない場合は何もしないこと", async () => {
		const nonChatInputInteraction = createMockInteraction({
			isChatInputCommand: () => false,
		});

		await handleInteraction(nonChatInputInteraction as Interaction);

		expect(commands.get).not.toHaveBeenCalled();
		expect(mockExecute).not.toHaveBeenCalled();
	});

	it("コマンドが見つからない場合は何もしないこと", async () => {
		(commands.get as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

		await handleInteraction(mockInteraction as Interaction);

		expect(commands.get).toHaveBeenCalledWith(mockCommandName);
		expect(mockExecute).not.toHaveBeenCalled();
	});

	it("コマンドが正常に実行されること", async () => {
		mockExecute.mockResolvedValue(undefined);

		await handleInteraction(mockInteraction as Interaction);

		expect(commands.get).toHaveBeenCalledWith(mockCommandName);
		expect(mockExecute).toHaveBeenCalledWith(mockInteraction);
		expect(mockInteraction.reply).not.toHaveBeenCalled(); // エラーがなければreplyは呼ばれない
	});

	it("コマンド実行でエラーが発生した場合、エラーメッセージが送信されること", async () => {
		const testError = new Error("コマンド実行エラー");
		mockExecute.mockRejectedValue(testError);

		await handleInteraction(mockInteraction as Interaction);

		expect(error).toHaveBeenCalled();
		expect(mockInteraction.reply).toHaveBeenCalledWith({
			content: "コマンドの実行中にエラーが発生したのだ...",
			ephemeral: true,
		});
	});

	it("既に応答済みの場合、followUpでエラーメッセージが送信されること", async () => {
		const testError = new Error("コマンド実行エラー");
		mockExecute.mockRejectedValue(testError);
		const repliedInteraction = createMockInteraction({
			replied: true,
		});

		await handleInteraction(repliedInteraction as Interaction);

		expect(error).toHaveBeenCalled();
		expect(repliedInteraction.followUp).toHaveBeenCalledWith({
			content: "コマンドの実行中にエラーが発生したのだ...",
			ephemeral: true,
		});
		expect(repliedInteraction.reply).not.toHaveBeenCalled();
	});

	it("すでに応答処理中の場合、followUpでエラーメッセージが送信されること", async () => {
		const testError = new Error("コマンド実行エラー");
		mockExecute.mockRejectedValue(testError);
		const deferredInteraction = createMockInteraction({
			deferred: true,
		});

		await handleInteraction(deferredInteraction as Interaction);

		expect(error).toHaveBeenCalled();
		expect(deferredInteraction.followUp).toHaveBeenCalledWith({
			content: "コマンドの実行中にエラーが発生したのだ...",
			ephemeral: true,
		});
		expect(deferredInteraction.reply).not.toHaveBeenCalled();
	});

	it("DiscordAPIError 40060エラーの場合は無視されること", async () => {
		const discordError = new MockDiscordAPIError("Already replied", 40060);
		mockExecute.mockRejectedValue(discordError);

		await handleInteraction(mockInteraction as Interaction);

		expect(error).not.toHaveBeenCalled();
		expect(mockInteraction.reply).not.toHaveBeenCalled();
		expect(mockInteraction.followUp).not.toHaveBeenCalled();
	});

	it("エラー応答中にDiscordAPIError 40060が発生した場合は無視されること", async () => {
		const testError = new Error("コマンド実行エラー");
		const discordError = new MockDiscordAPIError("Already replied", 40060);

		mockExecute.mockRejectedValue(testError);
		(mockInteraction.reply as ReturnType<typeof vi.fn>).mockRejectedValue(discordError);

		await handleInteraction(mockInteraction as Interaction);

		expect(error).toHaveBeenCalledWith("コマンドの実行中にエラーが発生したのだ:", testError);
		expect(mockInteraction.reply).toHaveBeenCalled();
		expect(error).not.toHaveBeenCalledWith("エラー応答の送信に失敗したのだ:", expect.any(Object));
	});

	it("エラー応答中に他のエラーが発生した場合は記録されること", async () => {
		const testError = new Error("コマンド実行エラー");
		const replyError = new Error("応答エラー");

		mockExecute.mockRejectedValue(testError);
		(mockInteraction.reply as ReturnType<typeof vi.fn>).mockRejectedValue(replyError);

		await handleInteraction(mockInteraction as Interaction);

		expect(error).toHaveBeenCalledWith("コマンドの実行中にエラーが発生したのだ:", testError);
		expect(error).toHaveBeenCalledWith("エラー応答の送信に失敗したのだ:", replyError);
	});
});
