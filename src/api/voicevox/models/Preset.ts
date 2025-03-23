/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * プリセット情報
 */
export type Preset = {
	/**
	 * プリセットID
	 */
	id: number;
	/**
	 * プリセット名
	 */
	name: string;
	/**
	 * キャラクターのUUID
	 */
	speaker_uuid: string;
	/**
	 * スタイルID
	 */
	style_id: number;
	/**
	 * 全体の話速
	 */
	speedScale: number;
	/**
	 * 全体の音高
	 */
	pitchScale: number;
	/**
	 * 全体の抑揚
	 */
	intonationScale: number;
	/**
	 * 全体の音量
	 */
	volumeScale: number;
	/**
	 * 音声の前の無音時間
	 */
	prePhonemeLength: number;
	/**
	 * 音声の後の無音時間
	 */
	postPhonemeLength: number;
	/**
	 * 句読点などの無音時間
	 */
	pauseLength?: number;
	/**
	 * 句読点などの無音時間（倍率）
	 */
	pauseLengthScale?: number;
};
