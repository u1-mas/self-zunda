import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import { CodeGenerator } from "@himenon/openapi-typescript-code-generator";
import * as Templates from "@himenon/openapi-typescript-code-generator/dist/templates";
import type * as Types from "@himenon/openapi-typescript-code-generator/dist/types";

/**
 * VOICEVOXのOpenAPI定義を取得します
 */
const fetchOpenApiSchema = async (url: string): Promise<void> => {
	console.log(`OpenAPI定義を取得中: ${url}/openapi.json`);
	try {
		const response = await axios.get(`${url}/openapi.json`);
		const jsonPath = path.resolve(process.cwd(), "voicevox_openapi.json");
		fs.writeFileSync(jsonPath, JSON.stringify(response.data, null, 2), { encoding: "utf-8" });
		console.log(`OpenAPI定義を保存しました: ${jsonPath}`);
	} catch (error) {
		console.error("OpenAPI定義の取得に失敗しました", error);
		throw error;
	}
};

/**
 * 型定義とAPIクライアントを生成します
 */
const generateCode = (): void => {
	console.log("コード生成を開始します...");

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

	console.log(`型定義を生成しました: ${typesPath}`);
	console.log(`APIクライアントを生成しました: ${apiClientPath}`);
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

		console.log("すべての処理が正常に完了しました！");
	} catch (error) {
		console.error("エラーが発生しました:", error);
		process.exit(1);
	}
};

// スクリプト実行
main().catch(console.error);
