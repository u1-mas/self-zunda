/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccentPhrase } from './AccentPhrase';
/**
 * 音声合成用のクエリ
 */
export type AudioQuery = {
    /**
     * アクセント句のリスト
     */
    accent_phrases: Array<AccentPhrase>;
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
     * 句読点などの無音時間。nullのときは無視される。デフォルト値はnull
     */
    pauseLength?: (number | null);
    /**
     * 句読点などの無音時間（倍率）。デフォルト値は1
     */
    pauseLengthScale?: number;
    /**
     * 音声データの出力サンプリングレート
     */
    outputSamplingRate: number;
    /**
     * 音声データをステレオ出力するか否か
     */
    outputStereo: boolean;
    /**
     * [読み取り専用]AquesTalk 風記法によるテキスト。音声合成用のクエリとしては無視される
     */
    kana?: string;
};

