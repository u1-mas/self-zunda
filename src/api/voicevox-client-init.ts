import { createClient, type ApiClient, type RequestArgs, type SuccessResponses } from "./voicevox-client";

// VOICEVOXのAPIの設定
const VOICEVOX_API_URL = process.env.VOICEVOX_API_URL || "http://localhost:50021";

// Fetch APIのヘッダータイプ
type HeadersInit = Record<string, string>;

// クライアントの初期化
const apiClient: ApiClient<RequestInit> = {
  request: async <T = SuccessResponses>(requestArgs: RequestArgs, options?: RequestInit): Promise<T> => {
    const { httpMethod, url: endpointUrl, headers, requestBody } = requestArgs;
    
    // Fetch APIを使用してリクエストを実行
    const options2: RequestInit = {
      method: httpMethod,
      headers: headers as HeadersInit,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
      ...options,
    };
    
    // パスの場合はVOICEVOXのベースURLと結合する
    // createClient側から渡されるURLはパスだけなので、常にベースURLと結合する
    const fullUrl = `${VOICEVOX_API_URL}${endpointUrl}`;
    
    const response = await fetch(fullUrl, options2);
    
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

// createClientに空文字列を渡して、URL結合はrequest関数内で行う
const client = createClient(apiClient, "");

export { client as voicevoxClient }; 