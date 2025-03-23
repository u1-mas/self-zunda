/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SpeakerStyle } from "./SpeakerStyle";
import type { SpeakerSupportedFeatures } from "./SpeakerSupportedFeatures";
/**
 * キャラクター情報
 */
export type Speaker = {
	/**
	 * 名前
	 */
	name: string;
	/**
	 * キャラクターのUUID
	 */
	speaker_uuid: string;
	/**
	 * スタイルの一覧
	 */
	styles: Array<SpeakerStyle>;
	/**
	 * キャラクターのバージョン
	 */
	version: string;
	/**
	 * キャラクターの対応機能
	 */
	supported_features?: SpeakerSupportedFeatures;
};
