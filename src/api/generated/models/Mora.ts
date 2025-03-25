/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * モーラ（子音＋母音）ごとの情報
 */
export type Mora = {
    /**
     * 文字
     */
    text: string;
    /**
     * 子音の音素
     */
    consonant?: string;
    /**
     * 子音の音長
     */
    consonant_length?: number;
    /**
     * 母音の音素
     */
    vowel: string;
    /**
     * 母音の音長
     */
    vowel_length: number;
    /**
     * 音高
     */
    pitch: number;
};

