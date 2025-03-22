import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { commandsData } from "./handlers/commands";

// RESTクラスのモック
const mockPut = jest
  .fn<() => Promise<Record<string, unknown>>>()
  .mockResolvedValue({});
const mockREST = {
  setToken: jest.fn().mockReturnThis(),
  put: mockPut,
};

// RESTクラスをモック化
jest.mock("discord.js", () => ({
  REST: jest.fn(() => mockREST),
  Routes: {
    applicationCommands: jest.fn(
      (clientId) => `applications/${clientId}/commands`,
    ),
  },
  SlashCommandBuilder: jest.fn().mockImplementation(() => ({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    toJSON: jest.fn().mockReturnValue({}),
  })),
  Collection: jest.fn().mockImplementation(() => {
    const items = new Map();
    return {
      set: jest.fn((key, value) => items.set(key, value)),
      get: jest.fn((key) => items.get(key)),
      values: jest.fn(() => items.values()),
    };
  }),
}));

// @discordjs/voiceのモック
jest.mock("@discordjs/voice", () => ({
  joinVoiceChannel: jest.fn(),
  createAudioPlayer: jest.fn(),
  createAudioResource: jest.fn(),
  AudioPlayerStatus: {
    Idle: "idle",
    Playing: "playing",
    Paused: "paused",
    Buffering: "buffering",
  },
}));

describe("deploy-commands", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
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
      "applications/test-client-id/commands",
      { body: commandsData },
    );
  });
});
