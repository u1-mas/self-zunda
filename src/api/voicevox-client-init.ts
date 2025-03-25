import { createClient, type ApiClient, type RequestArgs, type SuccessResponses } from "./voicevox-client";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";

// Fetch APIのヘッダータイプ
type HeadersInit = Record<string, string>;

// クライアントの初期化
const apiClient: ApiClient<Record<string, unknown>> = {
  request: async <T = SuccessResponses>(requestArgs: RequestArgs, options?: Record<string, unknown>): Promise<T> => {
    const { httpMethod, url: endpointUrl, headers, requestBody } = requestArgs;
    
    // Fetch APIを使用してリクエストを実行
    const options2: RequestInit = {
      method: httpMethod,
      headers: headers as HeadersInit,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    };
    
    // 完全なURLかパスかを判定し、パスの場合のみベースURLと結合
    const fullUrl = endpointUrl.startsWith('http') 
      ? endpointUrl 
      : `${VOICEVOX_API_URL}${endpointUrl}`;
    
    const response = await fetch(fullUrl, options2);
    
    // レスポンスの種類によって適切な処理を行う
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else if (contentType.includes("audio/wav")) {
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer as T;
    } else {
      return (await response.text()) as T;
    }
  }
};

// クライアントの作成（ベースURLにはVOICEVOX_API_URLを渡さず、request関数内で解決）
const client = createClient(apiClient, "");

export { client as voicevoxClient }; 