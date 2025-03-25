/**
 * VOICEVOX APIのエラー型
 */
export interface VoicevoxApiError extends Error {
	status: number;
	statusText: string;
	data?: unknown;
}

/**
 * axios エラーの型
 */
interface AxiosErrorLike {
	isAxiosError: boolean;
	response?: {
		status: number;
		statusText: string;
		data: unknown;
	};
	message: string;
}

/**
 * VOICEVOX API用のカスタムエラーを作成する
 */
export function createVoicevoxApiError(error: unknown): VoicevoxApiError {
	// axiosエラーの場合
	if (error && typeof error === "object" && "isAxiosError" in error && "message" in error) {
		const axiosError = error as AxiosErrorLike;

		const apiError = new Error(
			axiosError.response?.data
				? `${axiosError.message}: ${JSON.stringify(axiosError.response.data)}`
				: axiosError.message,
		) as VoicevoxApiError;

		apiError.status = axiosError.response?.status ?? 500;
		apiError.statusText = axiosError.response?.statusText ?? "Unknown Error";
		apiError.data = axiosError.response?.data;

		return apiError;
	}

	// その他のエラーの場合
	const apiError = new Error(
		error instanceof Error ? error.message : String(error),
	) as VoicevoxApiError;

	apiError.status = 500;
	apiError.statusText = "Internal Error";

	return apiError;
}
