import {
    AudioPlayer,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    VoiceConnection,
} from "@discordjs/voice";

// アクティブな音声プレイヤーを保持
const players = new Map<string, AudioPlayer>();

export function playAudio(
    connection: VoiceConnection,
    audioBuffer: Buffer,
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const guildId = connection.joinConfig.guildId;
            let player = players.get(guildId);

            if (!player) {
                player = createAudioPlayer();
                players.set(guildId, player);
                connection.subscribe(player);
            }

            const resource = createAudioResource(Buffer.from(audioBuffer), {
                inputType: StreamType.Raw,
            });

            player.play(resource);

            player.once("stateChange", (oldState, newState) => {
                if (newState.status === "idle") {
                    resolve();
                }
            });

            player.once("error", (error) => {
                console.error("音声の再生中にエラーが発生したのだ:", error);
                reject(error);
            });
        } catch (error) {
            console.error("音声リソースの作成中にエラーが発生したのだ:", error);
            reject(error);
        }
    });
}

export function stopAudio(guildId: string): void {
    const player = players.get(guildId);
    if (player) {
        player.stop();
    }
}

export function getPlayer(guildId: string): AudioPlayer | undefined {
    return players.get(guildId);
}
