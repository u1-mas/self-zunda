import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import { generateApi } from "swagger-typescript-api";

/**
 * VOICEVOXのOpenAPI定義を取得します
 */
const fetchOpenApiSchema = async (url: string): Promise<void> => {
	try {
		const response = await axios.get(`${url}/openapi.json`);
		const jsonPath = path.resolve(process.cwd(), "voicevox_openapi.json");
		fs.writeFileSync(jsonPath, JSON.stringify(response.data, null, 2), { encoding: "utf-8" });
	} catch (error) {
		console.error("OpenAPI定義の取得に失敗しました", error);
		throw error;
	}
};

/**
 * APIクライアントを生成します
 */
const generateApiClient = async (): Promise<void> => {
	try {
		const outputPath = path.resolve(process.cwd(), "src/api/generated");
		const schemaPath = path.resolve(process.cwd(), "voicevox_openapi.json");

		const _result = await generateApi({
			name: "VoicevoxApi.ts",
			output: outputPath,
			input: schemaPath,
			httpClientType: "axios", // axiosを使用
			modular: true, // モジュラー形式で出力
			unwrapResponseData: true, // レスポンスデータを直接返す
			hooks: {
				onCreateComponent: (component) => {
					// コンポーネント（型など）作成時のカスタマイズ
					return component;
				},
				onCreateRequestParams: (rawType) => {
					// リクエストパラメータ作成時のカスタマイズ
					return rawType;
				},
				onFormatTypeName: (typeName, _rawTypeName) => {
					// 型名のフォーマット
					return typeName;
				},
			},
		});
	} catch (error) {
		console.error("APIクライアントの生成に失敗しました", error);
		throw error;
	}
};

/**
 * メイン処理
 */
const main = async (): Promise<void> => {
	try {
		// VOICEVOXのOpenAPI定義を取得するURL（環境変数から取得するか、デフォルト値を使用）
		const voicevoxUrl = process.env.VOICEVOX_URL || "http://localhost:50021";

		// OpenAPI定義の取得
		await fetchOpenApiSchema(voicevoxUrl);

		// APIクライアント生成
		await generateApiClient();
	} catch (error) {
		console.error("エラーが発生しました:", error);
		process.exit(1);
	}
};

// スクリプト実行
main().catch(console.error);
