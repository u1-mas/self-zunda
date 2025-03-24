import type { Message } from "discord.js";
import { handleMessageCreate } from "./messageHandler";
import { handleMessage } from "../features/textToSpeech";

// モック
vi.mock("../features/textToSpeech", () => ({
	handleMessage: vi.fn().mockResolvedValue(undefined),
}));

describe("messageHandler", () => {
	let mockMessage: Partial<Message>;

	beforeEach(() => {
		vi.resetAllMocks();

		// メッセージモックの作成
		mockMessage = {
			id: "123456789",
			content: "テストメッセージ",
			author: {
				id: "987654321",
				username: "testuser",
				bot: false,
			},
		} as Partial<Message>;
	});

	it("メッセージがtextToSpeechハンドラに渡されること", async () => {
		await handleMessageCreate(mockMessage as Message);

		expect(handleMessage).toHaveBeenCalledWith(mockMessage);
		expect(handleMessage).toHaveBeenCalledTimes(1);
	});

	it("textToSpeechハンドラでエラーが発生しても処理が続行されること", async () => {
		const testError = new Error("テスト用エラー");
		(handleMessage as ReturnType<typeof vi.fn>).mockRejectedValue(testError);

		// エラーがスローされないことを確認
		await expect(handleMessageCreate(mockMessage as Message)).resolves.not.toThrow();
	});
});
