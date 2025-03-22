import axios from "axios";

const VOICEVOX_API_URL = "http://localhost:50021";
const SPEAKER_ID = 1; // ずんだもん（あまあま）

interface AudioQuery {
	accent_phrases: any[];
	speedScale: number;
	pitchScale: number;
	intonationScale: number;
	volumeScale: number;
	prePhonemeLength: number;
	postPhonemeLength: number;
	outputSamplingRate: number;
	outputStereo: boolean;
	kana: string;
}

export async function generateVoice(text: string): Promise<Buffer> {
	try {
		// 音声合成用のクエリを作成
		const query = await axios.post<AudioQuery>(
			`${VOICEVOX_API_URL}/audio_query`,
			null,
			{
				params: {
					text,
					speaker: SPEAKER_ID,
				},
			},
		);

		// 読み上げ速度を調整（0.8 = 20%遅く）
		query.data.speedScale = 1;
		// イントネーションを少し強く
		query.data.intonationScale = 1.2;
		// 音の長さを少し伸ばす
		query.data.prePhonemeLength = 0.1;
		query.data.postPhonemeLength = 0.1;

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

// VOICEVOXの接続テスト用関数
export async function testVoicevox(): Promise<{
	success: boolean;
	message: string;
}> {
	try {
		// VOICEVOXサーバーの状態を確認
		await axios.get(`${VOICEVOX_API_URL}/version`);

		// テスト用の短いテキストで音声生成を試す
		const testText = "テストなのだ！";
		await generateVoice(testText);

		return {
			success: true,
			message:
				"VOICEVOXサーバーに正常に接続できて、音声生成もできるのだ！",
		};
	} catch (error) {
		let message = "VOICEVOXサーバーに接続できないのだ...";
		if (axios.isAxiosError(error)) {
			if (error.code === "ECONNREFUSED") {
				message = "VOICEVOXサーバーが起動していないのだ！";
			} else {
				message = `エラーが発生したのだ: ${error.message}`;
			}
		}
		return {
			success: false,
			message,
		};
	}
}
