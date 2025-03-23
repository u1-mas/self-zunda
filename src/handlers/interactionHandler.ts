import type { Interaction } from "discord.js";
import { error } from "../utils/logger";
import { commands } from "./commands";

export async function handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        error("コマンドの実行中にエラーが発生したのだ:", err);
        const response = {
            content: "コマンドの実行中にエラーが発生したのだ...",
            ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(response);
        } else {
            await interaction.reply(response);
        }
    }
}
