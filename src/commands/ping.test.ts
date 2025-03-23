import {
    type ChatInputCommandInteraction,
    type Client,
    type InteractionEditReplyOptions,
    type InteractionReplyOptions,
    type Message,
    type MessagePayload,
    SlashCommandBuilder,
} from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { ping } from "./ping";

describe("ping command", () => {
    describe("data", () => {
        it("コマンドの設定が正しいか", () => {
            expect(ping.data).toBeInstanceOf(SlashCommandBuilder);
            expect(ping.data.name).toBe("ping");
            expect(ping.data.description).toBe("ぽんと返すのだ！");
        });
    });

    describe("execute", () => {
        it("正しくレイテンシーを計測して返信するか", async () => {
            const mockClient = {
                ws: {
                    ping: 50,
                },
            } as Client<true>;

            const mockReply = vi
                .fn()
                .mockImplementation(
                    async (
                        options:
                            | string
                            | MessagePayload
                            | InteractionReplyOptions,
                    ) => {
                        return {
                            createdTimestamp: 1000,
                        } as Message<boolean>;
                    },
                );

            const mockEditReply = vi
                .fn()
                .mockImplementation(
                    async (
                        options:
                            | string
                            | MessagePayload
                            | InteractionEditReplyOptions,
                    ) => {
                        return {} as Message<boolean>;
                    },
                );

            const mockInteractionObj = {
                reply: mockReply,
                editReply: mockEditReply,
                createdTimestamp: 900,
                client: mockClient,
                commandType: 1, // ChatInput
            };

            await ping.execute(
                mockInteractionObj as unknown as ChatInputCommandInteraction,
            );

            expect(mockReply).toHaveBeenCalledWith({
                content: "Pingを計測中なのだ...",
                fetchReply: true,
            });

            expect(mockEditReply).toHaveBeenCalledWith(
                "ぽんなのだ！ 🏓\nBotのレイテンシー: 100ms\nWebSocket: 50ms",
            );
        });
    });
});
