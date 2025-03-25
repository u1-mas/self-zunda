declare module "swagger-typescript-api" {
	export function generateApi(options: GenerateApiOptions): Promise<GenerateApiResult>;

	export interface GenerateApiOptions {
		name: string;
		output: string;
		input: string;
		httpClientType?: "fetch" | "axios";
		modular?: boolean;
		unwrapResponseData?: boolean;
		hooks?: {
			onCreateComponent?: (component: unknown) => unknown;
			onCreateRequestParams?: (rawType: unknown) => unknown;
			onFormatTypeName?: (typeName: string, rawTypeName?: string) => string;
		};
		// その他のオプション
		[key: string]: unknown;
	}

	export interface GenerateApiResult {
		files: Array<{
			name: string;
			content: string;
			[key: string]: unknown;
		}>;
		createClient: (options: Record<string, unknown>) => unknown;
		[key: string]: unknown;
	}
}
