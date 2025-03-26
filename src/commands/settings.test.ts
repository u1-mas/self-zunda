import type { SlashCommandSubcommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { settings } from "./settings.ts";

// 必要なモジュールをモック
vi.mock("../models/userSettings", () => ({
	getUserSettings: vi.fn().mockReturnValue({
		userId: "test-user-id",
		speakerId: 1,
		speedScale: 1.0,
		pitchScale: 0.0,
		intonationScale: 1.2,
		volumeScale: 1.0,
		enabled: true,
	}),
	updateUserSettings: vi.fn(),
	setServerDefaultSpeaker: vi.fn(),
}));

vi.mock("../utils/logger", () => ({
	log: vi.fn(),
	error: vi.fn(),
}));

describe("settings command", () => {
	it("should have correct name and description", () => {
		expect(settings.data.name).toBe("settings");
		expect(settings.data.description).toBe("ずんだもんの設定を変更するのだ");
	});

	it("should have required subcommands", () => {
		const subcommands = settings.data.options;
		const subcommandNames = subcommands.map((cmd) => cmd.toJSON().name);

		expect(subcommandNames).toContain("voice");
		expect(subcommandNames).toContain("style");
		expect(subcommandNames).toContain("speed");
		expect(subcommandNames).toContain("show");
		expect(subcommandNames).toContain("toggle");
		expect(subcommandNames).toContain("server-default");
	});

	it("should have voice options for speaker selection", () => {
		const voiceSubcommand = settings.data.options.find(
			(opt) => opt.toJSON().name === "voice",
		) as SlashCommandSubcommandBuilder;

		expect(voiceSubcommand).toBeDefined();

		if (voiceSubcommand?.options) {
			const speakerOption = voiceSubcommand.options[0];
			expect(speakerOption).toBeDefined();

			const optionData = speakerOption.toJSON();
			expect(optionData.name).toBe("speaker");
			expect(optionData.required).toBe(true);

			const choices = (optionData as { choices?: Array<{ name: string; value: string }> })?.choices;
			expect(choices).toBeDefined();
			expect(Array.isArray(choices)).toBe(true);

			const speakerNames = choices?.map((c) => c.name);
			expect(speakerNames).toContain("ずんだもん");
			expect(speakerNames).toContain("四国めたん");
			expect(speakerNames).toContain("春日部つむぎ");
		}
	});

	it("should have style command for style selection", () => {
		const styleSubcommand = settings.data.options.find(
			(opt) => opt.toJSON().name === "style",
		) as SlashCommandSubcommandBuilder;

		expect(styleSubcommand).toBeDefined();

		if (styleSubcommand?.options) {
			const speakerOption = styleSubcommand.options[0];
			expect(speakerOption).toBeDefined();
			expect(speakerOption.toJSON().name).toBe("speaker");
			expect(speakerOption.toJSON().required).toBe(true);

			const styleOption = styleSubcommand.options[1];
			expect(styleOption).toBeDefined();
			expect(styleOption.toJSON().name).toBe("style");
			expect(styleOption.toJSON().required).toBe(true);
		}
	});

	it("should handle execute function", async () => {
		const interaction = {
			options: {
				getSubcommand: vi.fn().mockReturnValue("show"),
			},
			guildId: "test-guild-id",
			user: {
				id: "test-user-id",
			},
			reply: vi.fn().mockResolvedValue(undefined),
		} as unknown as ChatInputCommandInteraction;

		await settings.execute(interaction);

		expect(interaction.options.getSubcommand).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalled();
	});
});
