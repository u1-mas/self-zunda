import type { Message } from "discord.js";
// vitestはglobalsがtrueなので、importする必要はない
// import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	formatChannelMentions,
	formatEmojis,
	formatMentions,
	formatMessage,
	formatUrls,
	formatWhitespace,
} from "./messageFormatter";

describe("messageFormatter", () => {
	// モック用オブジェクト
	let mockMessage: Partial<Message>;

	beforeEach(() => {
		// Messageオブジェクトのモック作成を簡素化
		mockMessage = {
			content: "",
			guild: {
				members: {
					cache: {
						get: (id: string) => (id === "123456" ? { displayName: "テストユーザー" } : undefined),
					},
				},
				channels: {
					cache: {
						get: (id: string) => (id === "789012" ? { name: "テストチャンネル" } : undefined),
					},
				},
			},
		} as unknown as Partial<Message>;
	});

	describe("formatUrls", () => {
		it("URLを「URL」に置換すること", () => {
			const input = "これはURLです: https://example.com と http://test.jp/page?param=1";
			const expected = "これはURLです: URL と URL";
			expect(formatUrls(input)).toBe(expected);
		});

		it("URLが含まれていない場合は元のテキストを返すこと", () => {
			const input = "これはURLではありません";
			expect(formatUrls(input)).toBe(input);
		});
	});

	describe("formatEmojis", () => {
		it("カスタム絵文字を削除すること", () => {
			const input = "こんにちは <:emoji:123456789> と <a:animated:987654321>";
			const expected = "こんにちは  と ";
			expect(formatEmojis(input)).toBe(expected);
		});

		it("絵文字が含まれていない場合は元のテキストを返すこと", () => {
			const input = "これは絵文字を含みません";
			expect(formatEmojis(input)).toBe(input);
		});
	});

	describe("formatMentions", () => {
		it("ユーザーメンションを表示名に置換すること", () => {
			const input = "こんにちは <@123456> さん";
			const expected = "こんにちは テストユーザーさん さん";
			expect(formatMentions(input, mockMessage as Message)).toBe(expected);
		});

		it("存在しないユーザーIDのメンションは空文字に置換すること", () => {
			const input = "こんにちは <@999999> さん";
			const expected = "こんにちは  さん";
			expect(formatMentions(input, mockMessage as Message)).toBe(expected);
		});

		it("メンションが含まれていない場合は元のテキストを返すこと", () => {
			const input = "これはメンションを含みません";
			expect(formatMentions(input, mockMessage as Message)).toBe(input);
		});
	});

	describe("formatChannelMentions", () => {
		it("チャンネルメンションをチャンネル名に置換すること", () => {
			const input = "ぜひ <#789012> に投稿してください";
			const expected = "ぜひ テストチャンネルチャンネル に投稿してください";
			expect(formatChannelMentions(input, mockMessage as Message)).toBe(expected);
		});

		it("存在しないチャンネルIDのメンションは空文字に置換すること", () => {
			const input = "ぜひ <#999999> に投稿してください";
			const expected = "ぜひ  に投稿してください";
			expect(formatChannelMentions(input, mockMessage as Message)).toBe(expected);
		});

		it("チャンネルメンションが含まれていない場合は元のテキストを返すこと", () => {
			const input = "これはチャンネルメンションを含みません";
			expect(formatChannelMentions(input, mockMessage as Message)).toBe(input);
		});
	});

	describe("formatWhitespace", () => {
		it("複数の空白文字を1つに整理すること", () => {
			const input = "これは   複数の   空白を   含みます";
			const expected = "これは 複数の 空白を 含みます";
			expect(formatWhitespace(input)).toBe(expected);
		});

		it("前後の空白を削除すること", () => {
			const input = "  前後に空白があります  ";
			const expected = "前後に空白があります";
			expect(formatWhitespace(input)).toBe(expected);
		});
	});

	describe("formatMessage", () => {
		it("全ての整形処理を適用すること", () => {
			mockMessage.content =
				"こんにちは <@123456> さん、<#789012> で https://example.com を見てね！ <:emoji:123456789>   ";
			const expected =
				"こんにちは テストユーザーさん さん、テストチャンネルチャンネル で URL を見てね！";
			expect(formatMessage(mockMessage as Message)).toBe(expected);
		});

		it("空のメッセージの場合は空文字を返すこと", () => {
			mockMessage.content = "";
			expect(formatMessage(mockMessage as Message)).toBe("");
		});

		it("空白のみのメッセージの場合は空文字を返すこと", () => {
			mockMessage.content = "   ";
			expect(formatMessage(mockMessage as Message)).toBe("");
		});
	});
});
