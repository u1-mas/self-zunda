import type {
	ChatInputCommandInteraction,
	Collection,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface Command {
	data:
		| SlashCommandBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
		| SlashCommandOptionsOnlyBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Clientクラスの拡張
declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
	}
}
