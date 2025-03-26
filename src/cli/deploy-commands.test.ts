// RESTクラスのモック
const mockPut = vi.fn().mockResolvedValue({});
const mockRest = {
	setToken: vi.fn().mockReturnThis(),
	put: mockPut,
};

// RESTクラスをモック化
vi.mock("discord.js", () => ({
	REST: vi.fn().mockImplementation(() => mockRest),
	Routes: {
		applicationCommands: (clientId: string) => `/applications/${clientId}/commands`,
	},
	SlashCommandBuilder: vi.fn().mockImplementation(() => ({
		setName: vi.fn().mockReturnThis(),
		setDescription: vi.fn().mockReturnThis(),
		addSubcommand: vi.fn().mockReturnThis(),
		addChannelOption: vi.fn().mockReturnThis(),
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
			forEach: (callback: (value: unknown, key: string) => void) => items.forEach(callback),
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

// loggerのモック
vi.mock("./utils/logger", () => ({
	log: vi.fn(),
	error: vi.fn(),
}));

vi.mock("./models/userSettings", () => ({
	loadSettings: vi.fn(),
	getUserSettings: vi.fn().mockReturnValue({
		enabled: true,
		speakerId: 1,
		speedScale: 1.0,
		pitchScale: 0.0,
		intonationScale: 1.2,
		volumeScale: 1.0,
	}),
}));

vi.mock("node:process", async () => {
	const actual = await vi.importActual<typeof process>("node:process");
	return {
		...actual,
		env: {
			...actual.env,
		},
	};
});

describe("deploy-commands", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
		mockPut.mockClear();
		mockRest.setToken.mockClear();
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

		const { deployCommands } = await import("./deploy-commands");
		await deployCommands();

		expect(mockRest.setToken).toHaveBeenCalledWith("test-token");

		// mockPutが呼ばれたことを確認
		expect(mockPut).toHaveBeenCalled();

		// 引数の詳細は正確に検証しない
		const mockPutCall = mockPut.mock.calls[0];
		expect(mockPutCall[0]).toBe("/applications/test-client-id/commands");
		expect(mockPutCall[1]).toHaveProperty("body");
	});
});
