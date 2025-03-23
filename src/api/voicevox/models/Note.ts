/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 音符ごとの情報
 */
export type Note = {
	/**
	 * ID
	 */
	id?: string | null;
	/**
	 * 音階
	 */
	key?: number;
	/**
	 * 音符のフレーム長
	 */
	frame_length: number;
	/**
	 * 音符の歌詞
	 */
	lyric: string;
};
