/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * キャラクターのスタイル情報
 */
export type SpeakerStyle = {
	/**
	 * スタイル名
	 */
	name: string;
	/**
	 * スタイルID
	 */
	id: number;
	/**
	 * スタイルの種類。talk:音声合成クエリの作成と音声合成が可能。singing_teacher:歌唱音声合成用のクエリの作成が可能。frame_decode:歌唱音声合成が可能。sing:歌唱音声合成用のクエリの作成と歌唱音声合成が可能。
	 */
	type?: SpeakerStyle.type;
};
export namespace SpeakerStyle {
	/**
	 * スタイルの種類。talk:音声合成クエリの作成と音声合成が可能。singing_teacher:歌唱音声合成用のクエリの作成が可能。frame_decode:歌唱音声合成が可能。sing:歌唱音声合成用のクエリの作成と歌唱音声合成が可能。
	 */
	export enum type {
		TALK = "talk",
		SINGING_TEACHER = "singing_teacher",
		FRAME_DECODE = "frame_decode",
		SING = "sing",
	}
}
