import axios from "axios";

const VOICEVOX_API_URL = "http://localhost:50021";
const SPEAKER_ID = 1; // ずんだもん（あまあま）

export async function generateVoice(text: string): Promise<Buffer> {
    try {
        // 音声合成用のクエリを作成
        const query = await axios.post(
            `${VOICEVOX_API_URL}/audio_query`,
            null,
            {
                params: {
                    text,
                    speaker: SPEAKER_ID,
                },
            },
        );

        // 音声合成を実行
        const synthesis = await axios.post(
            `${VOICEVOX_API_URL}/synthesis`,
            query.data,
            {
                params: {
                    speaker: SPEAKER_ID,
                },
                responseType: "arraybuffer",
            },
        );

        return Buffer.from(synthesis.data);
    } catch (error) {
        console.error("VOICEVOXでの音声生成に失敗したのだ:", error);
        throw error;
    }
}
