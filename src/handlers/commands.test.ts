import { Collection } from "discord.js";
import { ping } from "../commands/ping";
import { settings } from "../commands/settings";
import { join, leave } from "../commands/voice";
import { commands, commandsData } from "./commands";

describe("commands", () => {
	describe("commands collection", () => {
		it("コマンドが正しく登録されているか", () => {
			expect(commands).toBeInstanceOf(Collection);
			expect(commands.size).toBe(4);
			expect(commands.get("ping")).toBe(ping);
			expect(commands.get("join")).toBe(join);
			expect(commands.get("leave")).toBe(leave);
			expect(commands.get("settings")).toBe(settings);
		});
	});

	describe("commandsData", () => {
		it("コマンドデータが正しく変換されているか", () => {
			expect(Array.isArray(commandsData)).toBe(true);
			expect(commandsData.length).toBe(4);

			// 各コマンドのデータが正しい形式であることを確認
			for (const data of commandsData) {
				expect(data).toHaveProperty("name");
				expect(data).toHaveProperty("description");
			}
		});
	});
});
