import { DiscordAPIError, type Interaction } from "discord.js";
import { error } from "../utils/logger";
import { commands } from "./commands";

export async function handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        // インタラクションが既に応答済みの場合は無視する
        if (err instanceof DiscordAPIError && err.code === 40060) {
            return;
        }

        const response = {
            content: "コマンドの実行中にエラーが発生したのだ...",
            ephemeral: true,
        };

        error("コマンドの実行中にエラーが発生したのだ:", err);

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(response);
            } else {
                await interaction.reply(response);
            }
        } catch (replyError) {
            // 応答に失敗した場合は無視する（HMRなどの場合）
            if (
                replyError instanceof DiscordAPIError &&
                replyError.code === 40060
            ) {
                return;
            }
            error("エラー応答の送信に失敗したのだ:", replyError);
        }
    }
}
