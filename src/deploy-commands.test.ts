import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commandsData } from "./handlers/commands";

// RESTクラスのモック
const mockPut = vi
	.fn<() => Promise<Record<string, unknown>>>()
	.mockResolvedValue({});
const mockREST = {
	setToken: vi.fn().mockReturnThis(),
	put: mockPut,
};

// RESTクラスをモック化
vi.mock("discord.js", () => ({
	REST: vi.fn().mockImplementation(() => mockREST),
	Routes: {
		applicationCommands: (clientId: string) =>
			`/applications/${clientId}/commands`,
	},
	SlashCommandBuilder: vi.fn().mockImplementation(() => ({
		setName: vi.fn().mockReturnThis(),
		setDescription: vi.fn().mockReturnThis(),
		addSubcommand: vi.fn().mockReturnThis(),
		toJSON: vi.fn().mockReturnValue({ name: "test-command" }),
	})),
	ContextMenuCommandBuilder: vi.fn().mockImplementation(() => ({
		setName: vi.fn().mockReturnThis(),
		setType: vi.fn().mockReturnThis(),
		toJSON: vi.fn().mockReturnValue({ name: "test-context-menu" }),
	})),
	Message: vi.fn().mockImplementation((key: string, value: string) => ({
		[key]: value,
	})),
	User: vi.fn().mockImplementation((key: string) => ({ id: key })),
	Collection: vi.fn().mockImplementation(() => {
		const items = new Map();
		return {
			set: (key: string, value: unknown) => {
				items.set(key, value);
				return items;
			},
			at: (key: number) => items.get([...items.keys()][key]),
			get: (key: string) => items.get(key),
			forEach: (callback: (value: unknown, key: string) => void) =>
				items.forEach(callback),
			values: () => items.values(),
		};
	}),
}));

// @discordjs/voiceのモック
vi.mock("@discordjs/voice", () => ({
	joinVoiceChannel: vi.fn(),
	createAudioPlayer: vi.fn(),
	createAudioResource: vi.fn(),
	AudioPlayerStatus: {
		Idle: "idle",
		Playing: "playing",
		Paused: "paused",
		Buffering: "buffering",
	},
}));

vi.mock("node:process", () => ({
	env: {
		DISCORD_TOKEN: "test-token",
		DISCORD_CLIENT_ID: "test-client-id",
	},
}));

describe("deploy-commands", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
		vi.clearAllMocks();
	});

	it("環境変数が設定されていない場合はエラーを投げるのだ", async () => {
		process.env.DISCORD_TOKEN = undefined;
		process.env.CLIENT_ID = undefined;

		await expect(import("./deploy-commands")).rejects.toThrow(
			"必要な環境変数が設定されていないのだ！",
		);
	});

	it("コマンドの登録が成功するのだ", async () => {
		process.env.DISCORD_TOKEN = "test-token";
		process.env.CLIENT_ID = "test-client-id";

		await import("./deploy-commands");

		expect(mockREST.setToken).toHaveBeenCalledWith("test-token");
		expect(mockPut).toHaveBeenCalledWith(
			"/applications/test-client-id/commands",
			{ body: commandsData },
		);
	});
});
