/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * スタイルの追加情報
 */
export type StyleInfo = {
	/**
	 * スタイルID
	 */
	id: number;
	/**
	 * このスタイルのアイコンをbase64エンコードしたもの、あるいはURL
	 */
	icon: string;
	/**
	 * このスタイルの立ち絵画像をbase64エンコードしたもの、あるいはURL
	 */
	portrait?: string;
	/**
	 * サンプル音声をbase64エンコードしたもの、あるいはURL
	 */
	voice_samples: Array<string>;
};
