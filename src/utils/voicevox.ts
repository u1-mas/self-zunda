import type { Blob } from "node:buffer";
import { getUserSettings } from "../models/userSettings";
import { debug, error, log } from "./logger";
import { OpenAPI, Service, type AudioQuery } from "../api/voicevox";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";
log(`VOICEVOXのAPI URLが設定されました: ${VOICEVOX_API_URL}`);
const DEFAULT_SPEAKER_ID = Number(process.env.DEFAULT_SPEAKER) || 1; // ずんだもん（あまあま）

// OpenAPIの設定
OpenAPI.BASE = VOICEVOX_API_URL;

/**
 * 音声合成を実行する
 * @param text 音声合成するテキスト
 * @param serverId サーバーID（ユーザー設定のため）
 * @param userId ユーザーID（ユーザー設定のため）
 * @returns 音声データのバッファ
 */
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
		const query = await Service.audioQuery(text, speakerId);

		// 音声パラメータの設定
		debug("音声パラメータを設定するのだ");
		Object.assign(query, {
			speedScale,
			pitchScale,
			intonationScale,
			volumeScale,
			prePhonemeLength: 0.1, // 音の前後の長さを少し伸ばす
			postPhonemeLength: 0.1,
		});

		// 音声合成を実行
		debug("音声合成を実行するのだ");
		const audioBlob = await Service.synthesis(speakerId, query);

		// Blobをバッファに変換
		debug("合成結果をバッファに変換するのだ");
		let audioBuffer: Buffer;

		// テスト環境対応: 実際のBlobかどうかを確認
		if (
			typeof audioBlob === "object" &&
			audioBlob !== null &&
			"arrayBuffer" in audioBlob &&
			typeof audioBlob.arrayBuffer === "function"
		) {
			const arrayBuffer = await audioBlob.arrayBuffer();
			audioBuffer = Buffer.from(arrayBuffer);
		} else {
			// テスト環境では既にBufferまたはarrayBufferが返される想定
			audioBuffer = Buffer.from(audioBlob as unknown as ArrayBuffer);
		}

		debug("音声合成が成功したのだ");
		return audioBuffer;
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

/**
 * VOICEVOXサーバーのバージョンを取得する
 * @returns VOICEVOXサーバーのバージョン
 */
export async function getVoicevoxVersion(): Promise<string> {
	try {
		return await Service.version();
	} catch (err) {
		const message = getVoicevoxErrorMessage(err);
		error(message);
		throw err instanceof Error ? err : new Error(message);
	}
}

// VOICEVOXのエラーメッセージを生成する関数
function getVoicevoxErrorMessage(err: unknown): string {
	// ApiErrorかどうかをチェック
	if (err && typeof err === "object" && "status" in err && "message" in err) {
		const apiErr = err as { status: number; message: string };
		return `VOICEVOXサーバーからエラーレスポンスが返ってきたのだ: ${apiErr.status} ${apiErr.message}`;
	}

	// 接続エラーの場合
	if (err instanceof Error && err.message.includes("ECONNREFUSED")) {
		return `VOICEVOXサーバーが起動していないのだ！接続先: ${VOICEVOX_API_URL}`;
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
		const version = await getVoicevoxVersion();
		debug(`VOICEVOXバージョン: ${version}`);

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
