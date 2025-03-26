import { Collection } from "discord.js";
import { join } from "../commands/join";
import { leave } from "../commands/leave";
import { ping } from "../commands/ping";
import { settings } from "../commands/settings/index";
import { status } from "../commands/status";
import { commands, commandsData } from "./commands";

describe("commands", () => {
	describe("commands collection", () => {
		it("コマンドが正しく登録されているか", () => {
			expect(commands).toBeInstanceOf(Collection);
			expect(commands.size).toBe(5);
			expect(commands.get("ping")).toBe(ping);
			expect(commands.get("join")).toBe(join);
			expect(commands.get("leave")).toBe(leave);
			expect(commands.get("status")).toBe(status);
			expect(commands.get("settings")).toBe(settings);
		});
	});

	describe("commandsData", () => {
		it("コマンドデータが正しく変換されているか", () => {
			expect(Array.isArray(commandsData)).toBe(true);
			expect(commandsData.length).toBe(5);

			// 各コマンドのデータが正しい形式であることを確認
			for (const data of commandsData) {
				expect(data).toHaveProperty("name");
				expect(data).toHaveProperty("description");
			}
		});
	});
});
