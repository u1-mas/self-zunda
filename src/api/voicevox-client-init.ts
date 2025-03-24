import { createClient, type ApiClient, type RequestArgs, type SuccessResponses } from "./voicevox-client";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";

// Fetch APIのヘッダータイプ
type HeadersInit = Record<string, string>;

// クライアントの初期化
const apiClient: ApiClient<RequestInit> = {
  request: async <T = SuccessResponses>(requestArgs: RequestArgs, options?: RequestInit): Promise<T> => {
    const { httpMethod, url, headers, requestBody } = requestArgs;
    
    // Fetch APIを使用してリクエストを実行
    const options2: RequestInit = {
      method: httpMethod,
      headers: headers as HeadersInit,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      ...options,
    };
    
    const response = await fetch(`${VOICEVOX_API_URL}${url}`, options2);
    
    // レスポンスの種類によって適切な処理を行う
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else if (contentType.includes("audio/wav")) {
      return (await response.blob()) as T;
    } else {
      return (await response.text()) as T;
    }
  }
};

const client = createClient(apiClient, VOICEVOX_API_URL);

export { client as voicevoxClient }; 