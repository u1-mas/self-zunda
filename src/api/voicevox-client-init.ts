import { AudioQueryApi, SynthesisApi, VersionApi, SpeakersApi, InitializeSpeakerApi } from "./generated";
import { createVoicevoxApiError, type VoicevoxApiError } from "../templates/custom-request";
import { debug, error, log } from "../utils/logger";
import type { AudioQuery } from "./generated/data-contracts";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";
log(`VOICEVOXのAPI URLが設定されました: ${VOICEVOX_API_URL}`);

// APIクライアント初期化
const audioQueryClient = new AudioQueryApi({
	baseURL: VOICEVOX_API_URL,
});

const synthesisClient = new SynthesisApi({
	baseURL: VOICEVOX_API_URL,
});

const versionClient = new VersionApi({
	baseURL: VOICEVOX_API_URL,
});

const speakersClient = new SpeakersApi({
	baseURL: VOICEVOX_API_URL,
});

const initializeSpeakerClient = new InitializeSpeakerApi({
	baseURL: VOICEVOX_API_URL,
});

/**
 * エラーハンドリングを強化したVOICEVOXクライアント
 * 各メソッドでエラーハンドリングを統一して行う
 */
export const voicevoxClient = {
	// 音声合成用のクエリを作成
	audio_query: async (params: { text: string; speaker: number; coreVersion?: string }) => {
		try {
			return await audioQueryClient.audioQuery(
				{
					text: params.text,
					speaker: params.speaker,
					core_version: params.coreVersion,
				},
			);
		} catch (err) {
			const apiError = createVoicevoxApiError(err);
			error(`音声合成クエリ作成でエラーが発生しました: ${apiError.status} ${apiError.message}`);
			throw apiError;
		}
	},
	
	// 音声合成を実行
	synthesis: async (params: { 
		speaker: number; 
		requestBody: AudioQuery; 
		enableInterrogativeUpspeak?: boolean; 
		coreVersion?: string 
	}) => {
		try {
			return await synthesisClient.synthesis(
				{
					speaker: params.speaker,
					enable_interrogative_upspeak: params.enableInterrogativeUpspeak,
					core_version: params.coreVersion,
				},
				params.requestBody,
			);
		} catch (err) {
			const apiError = createVoicevoxApiError(err);
			error(`音声合成でエラーが発生しました: ${apiError.status} ${apiError.message}`);
			throw apiError;
		}
	},
	
	// バージョン情報を取得
	version: async () => {
		try {
			return await versionClient.version();
		} catch (err) {
			const apiError = createVoicevoxApiError(err);
			error(`バージョン取得でエラーが発生しました: ${apiError.status} ${apiError.message}`);
			throw apiError;
		}
	},
	
	// 話者一覧を取得
	speakers: async () => {
		try {
			return await speakersClient.speakers();
		} catch (err) {
			const apiError = createVoicevoxApiError(err);
			error(`話者一覧取得でエラーが発生しました: ${apiError.status} ${apiError.message}`);
			throw apiError;
		}
	},
	
	// 話者を初期化
	initialize_speaker: async (params: { speaker: number; skipReinit?: boolean; coreVersion?: string }) => {
		try {
			return await initializeSpeakerClient.initializeSpeaker(
				{
					speaker: params.speaker,
					skip_reinit: params.skipReinit,
					core_version: params.coreVersion,
				}
			);
		} catch (err) {
			const apiError = createVoicevoxApiError(err);
			error(`話者初期化でエラーが発生しました: ${apiError.status} ${apiError.message}`);
			throw apiError;
		}
	},
};
