import axios from "axios";
import { getUserSettings } from "../models/userSettings";
import type { components } from "../types/voicevox";
import { debug, error, log } from "./logger";

const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";
log(`VOICEVOXのAPI URLが設定されました: ${VOICEVOX_API_URL}`);
const DEFAULT_SPEAKER_ID = Number(process.env.DEFAULT_SPEAKER) || 1; // ずんだもん（あまあま）

// OpenAPI型定義から型をインポート
type AudioQuery = components["schemas"]["AudioQuery"];

export async function generateVoice(
	text: string,
	serverId?: string,
	userId?: string,
): Promise<Buffer> {
	try {
		// ユーザー設定を取得
		let speakerId = DEFAULT_SPEAKER_ID;
		let speedScale = 1.0;
		let pitchScale = 0.0;
		let intonationScale = 1.2;
		let volumeScale = 1.0;

		// ユーザーIDが指定されていれば設定を適用
		if (serverId && userId) {
			const settings = getUserSettings(serverId, userId);

			// ユーザーの設定が有効でないなら、処理を中止
			if (!settings.enabled) {
				throw new Error("ユーザーの読み上げが無効になっているのだ");
			}

			speakerId = settings.speakerId;
			speedScale = settings.speedScale;
			pitchScale = settings.pitchScale;
			intonationScale = settings.intonationScale;
			volumeScale = settings.volumeScale;
		}

		// 音声合成用のクエリを作成
		debug(`「${text}」の音声合成クエリを作成するのだ (話者ID: ${speakerId})`);
		const query = await axios.post<AudioQuery>(`${VOICEVOX_API_URL}/audio_query`, null, {
			params: {
				text,
				speaker: speakerId,
			},
		});

		// 音声パラメータの設定
		debug("音声パラメータを設定するのだ");
		Object.assign(query.data, {
			speedScale,
			pitchScale,
			intonationScale,
			volumeScale,
			prePhonemeLength: 0.1, // 音の前後の長さを少し伸ばす
			postPhonemeLength: 0.1,
		});

		// 音声合成を実行
		debug("音声合成を実行するのだ");
		const synthesis = await axios.post(`${VOICEVOX_API_URL}/synthesis`, query.data, {
			params: { speaker: speakerId },
			responseType: "arraybuffer",
		});

		debug("音声合成が成功したのだ");
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
			return `VOICEVOXサーバーが起動していないのだ！接続先: ${VOICEVOX_API_URL}`;
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
	log(`VOICEVOXサーバーの接続テストを開始するのだ！使用するURL: ${VOICEVOX_API_URL}`);
	try {
		// バージョン確認とテスト音声生成を実行
		debug("VOICEVOXサーバーのバージョンを確認するのだ");
		await axios.get(`${VOICEVOX_API_URL}/version`);
		debug("テスト音声を生成するのだ");
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
