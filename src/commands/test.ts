import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { testVoicevox } from "../utils/voicevox";

export const test = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("VOICEVOXの接続テストを行うのだ"),
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const result = await testVoicevox();
            await interaction.editReply({
                content: result.message,
            });
        } catch (error) {
            console.error(
                "テストコマンドの実行中にエラーが発生したのだ:",
                error,
            );
            await interaction.editReply({
                content: "テストの実行中にエラーが発生したのだ...",
            });
        }
    },
};
