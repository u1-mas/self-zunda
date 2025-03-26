import axios, { type AxiosError } from "axios";
import type { AudioQuery } from "./generated";

const BASE_URL = process.env.VOICEVOX_API_URL ?? "http://localhost:50021";

// エラーメッセージの定義
const ERROR_MESSAGES = {
	CONNECTION: "VOICEVOXサーバーへの接続に失敗しました",
	TIMEOUT: "リクエストがタイムアウトしました",
	NOT_FOUND: "リクエストされたリソースが見つかりませんでした",
	SERVER_ERROR: "VOICEVOXサーバーでエラーが発生しました",
	UNKNOWN: "不明なエラーが発生しました",
};

// エラーハンドリング用のヘルパー関数
const handleAxiosError = (error: unknown): never => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError;

		if (axiosError.code === "ECONNREFUSED") {
			throw new Error(`${ERROR_MESSAGES.CONNECTION}: VOICEVOXが起動していない可能性があります`);
		}

		if (axiosError.code === "ETIMEDOUT") {
			throw new Error(ERROR_MESSAGES.TIMEOUT);
		}

		switch (axiosError.response?.status) {
			case 404:
				throw new Error(ERROR_MESSAGES.NOT_FOUND);
			case 500:
				throw new Error(ERROR_MESSAGES.SERVER_ERROR);
			default:
				throw new Error(`${ERROR_MESSAGES.UNKNOWN}: ${axiosError.message}`);
		}
	}

	// Axiosエラーでない場合
	throw new Error(`${ERROR_MESSAGES.UNKNOWN}: ${String(error)}`);
};

// リクエストタイムアウトの設定（10秒）
const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
});

export const voicevoxClient = {
	version: async () => {
		try {
			const response = await axiosInstance.get("/version");
			return response.data;
		} catch (error) {
			return handleAxiosError(error);
		}
	},

	speakers: async () => {
		try {
			const response = await axiosInstance.get("/speakers");
			return response.data;
		} catch (error) {
			return handleAxiosError(error);
		}
	},

	audio_query: async (text: string, speaker = 1) => {
		try {
			const response = await axiosInstance.post("/audio_query", null, {
				params: { text, speaker },
			});
			return response.data as AudioQuery;
		} catch (error) {
			return handleAxiosError(error);
		}
	},

	synthesis: async (audioQuery: AudioQuery, speaker = 1): Promise<Buffer> => {
		try {
			const response = await axiosInstance.post("/synthesis", audioQuery, {
				params: { speaker },
				responseType: "arraybuffer",
			});
			return Buffer.from(response.data);
		} catch (error) {
			return handleAxiosError(error);
		}
	},
};
