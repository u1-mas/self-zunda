import axios from "axios";
import { error, log } from "./logger";

const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";
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
		const query = await axios.post<AudioQuery>(`${VOICEVOX_API_URL}/audio_query`, null, {
			params: {
				text,
				speaker: SPEAKER_ID,
			},
		});

		// 音声パラメータの設定
		Object.assign(query.data, {
			speedScale: 1, // 標準速度
			intonationScale: 1.2, // イントネーションを少し強く
			prePhonemeLength: 0.1, // 音の前後の長さを少し伸ばす
			postPhonemeLength: 0.1,
		});

		// 音声合成を実行
		const synthesis = await axios.post(`${VOICEVOX_API_URL}/synthesis`, query.data, {
			params: { speaker: SPEAKER_ID },
			responseType: "arraybuffer",
		});

		return Buffer.from(synthesis.data);
	} catch (err) {
		// エラーメッセージを生成
		const message = getVoicevoxErrorMessage(err);
		error(message);

		// エラーを再スロー
		if (err instanceof Error) {
			throw err;
		}
		throw new Error(message);
	}
}

// VOICEVOXのエラーメッセージを生成する関数
function getVoicevoxErrorMessage(err: unknown): string {
	if (axios.isAxiosError(err)) {
		if (err.code === "ECONNREFUSED") {
			return "VOICEVOXサーバーが起動していないのだ！";
		}
		if (err.response) {
			return `VOICEVOXサーバーからエラーレスポンスが返ってきたのだ: ${err.response.status} ${err.response.statusText}\n詳細: ${JSON.stringify(
				err.response.data,
			)}`;
		}
		return `VOICEVOXサーバーへのリクエストに失敗したのだ: ${err.message}`;
	}
	return `VOICEVOXでの音声生成に失敗したのだ: ${
		err instanceof Error ? err.message : "予期せぬエラーが発生したのだ..."
	}`;
}

// VOICEVOXの接続テスト用関数
export async function checkVoicevoxServerHealth(): Promise<boolean> {
	log("VOICEVOXサーバーの接続テストを開始するのだ！");
	try {
		// バージョン確認とテスト音声生成を実行
		await axios.get(`${VOICEVOX_API_URL}/version`);
		await generateVoice("テストなのだ！");

		log("VOICEVOXサーバーに正常に接続できて、音声生成もできるのだ！");
		return true;
	} catch (err) {
		const message = getVoicevoxErrorMessage(err);
		error(message);

		if (err instanceof Error) {
			throw err;
		}
		throw new Error(message);
	}
}
