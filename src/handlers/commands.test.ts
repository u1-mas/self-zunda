import { Collection } from "discord.js";
import { ping } from "../commands/ping";
import { join, leave } from "../commands/voice";
import { commands, commandsData } from "./commands";

describe("commands", () => {
	describe("commands collection", () => {
		it("コマンドが正しく登録されているか", () => {
			expect(commands).toBeInstanceOf(Collection);
			expect(commands.size).toBe(3);
			expect(commands.get("ping")).toBe(ping);
			expect(commands.get("join")).toBe(join);
			expect(commands.get("leave")).toBe(leave);
		});
	});

	describe("commandsData", () => {
		it("コマンドデータが正しく変換されているか", () => {
			expect(Array.isArray(commandsData)).toBe(true);
			expect(commandsData.length).toBe(3);

			// 各コマンドのデータが正しい形式であることを確認
			for (const data of commandsData) {
				expect(data).toHaveProperty("name");
				expect(data).toHaveProperty("description");
			}
		});
	});
});
