import axios from "axios";
import { error, log } from "./logger";

const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL ||
	"http://localhost:50021";
const SPEAKER_ID = Number(process.env.DEFAULT_SPEAKER) || 1; // ずんだもん（あまあま）

interface AccentPhrase {
	moras: {
		text: string;
		consonant?: string;
		consonant_length?: number;
		vowel: string;
		vowel_length: number;
		pitch: number;
	}[];
	accent: number;
	pause_mora?: {
		text: string;
		consonant?: string;
		consonant_length?: number;
		vowel: string;
		vowel_length: number;
		pitch: number;
	};
	is_interrogative?: boolean;
}

interface AudioQuery {
	accent_phrases: AccentPhrase[];
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
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.code === "ECONNREFUSED") {
				error("VOICEVOXサーバーが起動していないのだ！");
				throw new Error("VOICEVOXサーバーが起動していないのだ！");
			}
			if (err.response) {
				error(
					`VOICEVOXサーバーからエラーレスポンスが返ってきたのだ: ${err.response.status} ${err.response.statusText}\n詳細: ${
						JSON.stringify(err.response.data)
					}`,
				);
				throw new Error(
					`VOICEVOXサーバーエラー: ${err.response.status} ${err.response.statusText}`,
				);
			}
			error(
				`VOICEVOXサーバーへのリクエストに失敗したのだ: ${err.message}\n詳細: ${err}`,
			);
			throw new Error(
				`VOICEVOXサーバーへのリクエストに失敗: ${err.message}`,
			);
		}
		error(
			`VOICEVOXでの音声生成に失敗したのだ: ${
				err instanceof Error
					? err.message
					: "予期せぬエラーが発生したのだ..."
			}\n詳細: ${err}`,
		);
		throw err;
	}
}

// VOICEVOXの接続テスト用関数
export async function checkVoicevoxServerHealth(): Promise<void> {
	try {
		// VOICEVOXサーバーの状態を確認
		await axios.get(`${VOICEVOX_API_URL}/version`, {
			timeout: 5000,
		});

		// テスト用の短いテキストで音声生成を試す
		const testText = "テストなのだ！";
		await generateVoice(testText);

		log("VOICEVOXサーバーに正常に接続できて、音声生成もできるのだ！");
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.code === "ECONNREFUSED") {
				error("VOICEVOXサーバーが起動していないのだ！");
				throw new Error("VOICEVOXサーバーが起動していないのだ！");
			}
			if (err.response) {
				error(
					`VOICEVOXサーバーからエラーレスポンスが返ってきたのだ: ${err.response.status} ${err.response.statusText}\n詳細: ${
						JSON.stringify(err.response.data)
					}`,
				);
				throw new Error(
					`VOICEVOXサーバーエラー: ${err.response.status} ${err.response.statusText}`,
				);
			}
			error(
				`VOICEVOXサーバーへのリクエストに失敗したのだ: ${err.message}\n詳細: ${err}`,
			);
			throw new Error(
				`VOICEVOXサーバーへのリクエストに失敗: ${err.message}`,
			);
		}
		error(
			`VOICEVOXサーバーの状態チェックに失敗したのだ: ${
				err instanceof Error
					? err.message
					: "予期せぬエラーが発生したのだ..."
			}\n詳細: ${err}`,
		);
		throw err;
	}
}
