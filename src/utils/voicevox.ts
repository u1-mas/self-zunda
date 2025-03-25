import type { Blob } from "node:buffer";
import { voicevoxClient } from "../api/voicevox-client-init";
import { getUserSettings } from "../models/userSettings";
import type { Schemas } from "../types/voicevox";
import { debug, error, log } from "./logger";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";
log(`VOICEVOXのAPI URLが設定されました: ${VOICEVOX_API_URL}`);
const DEFAULT_SPEAKER_ID = Number(process.env.DEFAULT_SPEAKER) || 1; // ずんだもん（あまあま）

/**
 * ユーザー音声設定の型定義
 */
export interface VoiceParameters {
	speakerId: number;
	speedScale: number;
	pitchScale: number;
	intonationScale: number;
	volumeScale: number;
}

/**
 * デフォルトの音声パラメータ
 */
export const DEFAULT_VOICE_PARAMETERS: VoiceParameters = {
	speakerId: DEFAULT_SPEAKER_ID,
	speedScale: 1.0,
	pitchScale: 0.0,
	intonationScale: 1.2,
	volumeScale: 1.0,
};

/**
 * ユーザー設定から音声パラメータを取得する
 * @param serverId サーバーID
 * @param userId ユーザーID
 * @returns 音声パラメータのオブジェクト
 * @throws ユーザーの読み上げが無効の場合はエラーをスロー
 */
export function getVoiceParameters(serverId?: string, userId?: string): VoiceParameters {
	// サーバーIDとユーザーIDが指定されていなければデフォルト設定を返す
	if (!serverId || !userId) {
		return { ...DEFAULT_VOICE_PARAMETERS };
	}

	// ユーザー設定を取得
	const settings = getUserSettings(serverId, userId);

	// ユーザーの設定が有効でないなら、エラーをスロー
	if (!settings.enabled) {
		throw new Error("ユーザーの読み上げが無効になっているのだ");
	}

	// 設定から音声パラメータを取得
	return {
		speakerId: settings.speakerId,
		speedScale: settings.speedScale,
		pitchScale: settings.pitchScale,
		intonationScale: settings.intonationScale,
		volumeScale: settings.volumeScale,
	};
}

/**
 * AudioQueryに音声パラメータを適用する
 * @param query AudioQueryオブジェクト
 * @param params 音声パラメータ
 * @returns 更新されたAudioQueryオブジェクト
 */
function applyVoiceParameters(
	query: Schemas.AudioQuery,
	params: VoiceParameters,
): Schemas.AudioQuery {
	// クエリのコピーを作成して変更
	const updatedQuery = { ...query };

	// 音声パラメータの設定
	Object.assign(updatedQuery, {
		speedScale: params.speedScale,
		pitchScale: params.pitchScale,
		intonationScale: params.intonationScale,
		volumeScale: params.volumeScale,
		prePhonemeLength: 0.1, // 音の前後の長さを少し伸ばす
		postPhonemeLength: 0.1,
	});

	return updatedQuery;
}

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
): Promise<ArrayBuffer> {
	try {
		// ユーザー設定から音声パラメータを取得
		const voiceParams = getVoiceParameters(serverId, userId);

		// 音声合成用のクエリを作成
		debug(`「${text}」の音声合成クエリを作成するのだ (話者ID: ${voiceParams.speakerId})`);
		const query = await voicevoxClient.audio_query({
			parameter: {
				text,
				speaker: voiceParams.speakerId,
			},
		});

		// 音声パラメータの設定
		debug("音声パラメータを設定するのだ");
		const updatedQuery = applyVoiceParameters(query, voiceParams);

		// 音声合成を実行
		debug("音声合成を実行するのだ");
		const audioBlob = await voicevoxClient.synthesis({
			parameter: {
				speaker: voiceParams.speakerId,
			},
			requestBody: {
				...updatedQuery,
				outputSamplingRate: 24000,
				outputStereo: false,
			},
		});

		debug("音声合成が成功したのだ！");
		return Buffer.from(audioBlob);
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
 * BlobまたはArrayBufferをNodeのBufferに変換
 * @param blob 変換するBlob
 * @returns Buffer
 */
async function convertBlobToBuffer(blob: Blob | ArrayBuffer): Promise<Buffer> {
	// テスト環境対応: 実際のBlobかどうかを確認
	if (
		typeof blob === "object" &&
		blob !== null &&
		"arrayBuffer" in blob &&
		typeof blob.arrayBuffer === "function"
	) {
		const arrayBuffer = await blob.arrayBuffer();
		return Buffer.from(arrayBuffer);
	}

	// テスト環境では既にBufferまたはarrayBufferが返される想定
	return Buffer.from(blob as unknown as ArrayBuffer);
}

/**
 * VOICEVOXサーバーのバージョンを取得する
 * @returns VOICEVOXサーバーのバージョン
 */
export async function getVoicevoxVersion(): Promise<string> {
	try {
		return await voicevoxClient.version();
	} catch (err) {
		const message = getVoicevoxErrorMessage(err);
		error(message);
		throw err instanceof Error ? err : new Error(message);
	}
}

/**
 * VOICEVOXのエラーメッセージを生成する関数
 * @param err エラーオブジェクト
 * @returns 整形されたエラーメッセージ
 */
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

	// その他のエラー
	return `VOICEVOXでの音声生成に失敗したのだ: ${
		err instanceof Error ? err.message : "予期せぬエラーが発生したのだ..."
	}`;
}

/**
 * VOICEVOXの接続テスト用関数
 * @returns 接続テストが成功した場合はtrue
 * @throws 接続テストが失敗した場合はエラーをスロー
 */
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
