import { Message, TextChannel } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { generateVoice } from "../utils/voicevox";
import { playAudio } from "../utils/audio";

// 読み上げを有効にしているチャンネルを保持
const activeChannels = new Map<string, string>(); // guildId -> channelId

export function isTextToSpeechEnabled(
    guildId: string,
    channelId: string,
): boolean {
    return activeChannels.get(guildId) === channelId;
}

export function enableTextToSpeech(guildId: string, channelId: string): void {
    activeChannels.set(guildId, channelId);
}

export function disableTextToSpeech(guildId: string): void {
    activeChannels.delete(guildId);
}

export async function handleMessage(message: Message): Promise<void> {
    // ボットのメッセージは無視
    if (message.author.bot) return;

    // DMは無視
    if (!message.guild) return;

    // チャンネルが有効化されているか確認
    if (!isTextToSpeechEnabled(message.guild.id, message.channel.id)) return;

    // ボイスコネクションを取得
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return;

    try {
        // メッセージを整形
        const text = formatMessage(message);
        if (!text) return;

        // 音声を生成して再生
        const audioBuffer = await generateVoice(text);
        await playAudio(connection, audioBuffer);
    } catch (error) {
        console.error("メッセージの読み上げに失敗したのだ:", error);
        if (message.channel instanceof TextChannel) {
            await message.channel.send("メッセージの読み上げに失敗したのだ...");
        }
    }
}

function formatMessage(message: Message): string {
    let text = message.content;

    // URLを削除
    text = text.replace(/https?:\/\/\S+/g, "URL");

    // 絵文字を削除
    text = text.replace(/<a?:\w+:\d+>/g, "");

    // メンションを置換
    text = text.replace(/<@!?(\d+)>/g, (match, id) => {
        const member = message.guild?.members.cache.get(id);
        return member ? `${member.displayName}さん` : "";
    });

    // チャンネルメンションを置換
    text = text.replace(/<#(\d+)>/g, (match, id) => {
        const channel = message.guild?.channels.cache.get(id);
        return channel ? `${channel.name}チャンネル` : "";
    });

    // 空白文字を整理
    text = text.trim().replace(/\s+/g, " ");

    return text || "";
}
