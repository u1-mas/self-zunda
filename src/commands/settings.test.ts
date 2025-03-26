import type { SlashCommandBuilder } from "discord.js";
import type { APIApplicationCommandSubcommandOption } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { settings } from "./settings";

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

vi.mock("discord.js", () => {
	const actual = vi.importActual("discord.js");
	return {
		...actual,
		SlashCommandBuilder: vi.fn().mockImplementation(() => ({
			setName: vi.fn().mockReturnThis(),
			setDescription: vi.fn().mockReturnThis(),
			addSubcommand: vi.fn().mockReturnThis(),
			options: [],
			name: "settings",
			description: "ずんだもんの設定を変更するのだ",
		})),
		EmbedBuilder: vi.fn().mockImplementation(() => ({
			setTitle: vi.fn().mockReturnThis(),
			setDescription: vi.fn().mockReturnThis(),
			addFields: vi.fn().mockReturnThis(),
		})),
	};
});

describe("settings command", () => {
	let command: SlashCommandBuilder;

	beforeEach(() => {
		command = settings.data as unknown as SlashCommandBuilder;
	});

	it("should have correct name and description", () => {
		expect(command.name).toBe("settings");
		expect(command.description).toBe("ずんだもんの設定を変更するのだ");
	});

	it("should have required subcommands", () => {
		const subcommands = command.options;
		const subcommandNames = subcommands.map((cmd) => cmd.toJSON().name);

		expect(subcommandNames).toContain("voice");
		expect(subcommandNames).toContain("speed");
		expect(subcommandNames).toContain("show");
		expect(subcommandNames).toContain("toggle");
		expect(subcommandNames).toContain("server-default");
		expect(subcommandNames).toContain("list-voices");
	});

	it("should have voice options for speaker selection", () => {
		const voiceSubcommand = command.options
			.find((opt) => opt.toJSON().name === "voice")
			?.toJSON() as APIApplicationCommandSubcommandOption;

		expect(voiceSubcommand).toBeDefined();
		expect(voiceSubcommand.description).toBe(
			"声のキャラクターを変更するのだ\n例: /settings voice ずんだもん",
		);
		expect(voiceSubcommand.options).toHaveLength(1);

		if (voiceSubcommand.options) {
			const speakerOption = voiceSubcommand.options[0];
			expect(speakerOption).toBeDefined();

			expect(speakerOption.name).toBe("speaker");
			expect(speakerOption.required).toBe(true);
		}
	});

	it("should handle execute function", async () => {
		const mockInteraction = {
			options: {
				getSubcommand: vi.fn().mockReturnValue("show"),
			},
			guildId: "test-guild-id",
			user: {
				id: "test-user-id",
			},
			reply: vi.fn(),
		} as unknown as ChatInputCommandInteraction;

		await settings.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalled();
	});
});
