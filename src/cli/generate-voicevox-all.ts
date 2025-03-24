import * as fs from "node:fs";
import * as path from "node:path";
import { CodeGenerator } from "@himenon/openapi-typescript-code-generator";
import * as Templates from "@himenon/openapi-typescript-code-generator/dist/templates";
import type * as Types from "@himenon/openapi-typescript-code-generator/dist/types";
import axios from "axios";

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
 * 型定義とAPIクライアントを生成します
 */
const generateCode = (): void => {
	const openApiJsonPath = path.resolve(process.cwd(), "voicevox_openapi.json");
	const codeGenerator = new CodeGenerator(openApiJsonPath);

	// 関数型APIクライアントのテンプレートを設定
	const apiClientGeneratorTemplate: Types.CodeGenerator.CustomGenerator<Templates.FunctionalApiClient.Option> =
		{
			generator: Templates.FunctionalApiClient.generator,
			option: {},
		};

	// 型定義の生成
	const typeDefCode = codeGenerator.generateTypeDefinition();

	// APIクライアントコードの生成
	const apiClientCode = codeGenerator.generateCode([
		{
			generator: () => {
				return [`import { Schemas, Responses } from "../types/voicevox";`];
			},
		},
		codeGenerator.getAdditionalTypeDefinitionCustomCodeGenerator(),
		apiClientGeneratorTemplate,
	]);

	// ディレクトリの存在を確認し、必要に応じて作成
	const typesDir = path.resolve(process.cwd(), "src/types");
	const apiDir = path.resolve(process.cwd(), "src/api");

	if (!fs.existsSync(typesDir)) {
		fs.mkdirSync(typesDir, { recursive: true });
	}

	if (!fs.existsSync(apiDir)) {
		fs.mkdirSync(apiDir, { recursive: true });
	}

	// ファイルに書き出し
	const typesPath = path.resolve(typesDir, "voicevox.ts");
	const apiClientPath = path.resolve(apiDir, "voicevox-client.ts");

	fs.writeFileSync(typesPath, typeDefCode, { encoding: "utf-8" });
	fs.writeFileSync(apiClientPath, apiClientCode, { encoding: "utf-8" });
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

		// コード生成
		generateCode();
	} catch (error) {
		console.error("エラーが発生しました:", error);
		process.exit(1);
	}
};

// スクリプト実行
main().catch(console.error);
