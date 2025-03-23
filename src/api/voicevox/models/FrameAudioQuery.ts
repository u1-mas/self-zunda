/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FramePhoneme } from './FramePhoneme';
/**
 * フレームごとの音声合成用のクエリ
 */
export type FrameAudioQuery = {
    /**
     * フレームごとの基本周波数
     */
    f0: Array<number>;
    /**
     * フレームごとの音量
     */
    volume: Array<number>;
    /**
     * 音素のリスト
     */
    phonemes: Array<FramePhoneme>;
    /**
     * 全体の音量
     */
    volumeScale: number;
    /**
     * 音声データの出力サンプリングレート
     */
    outputSamplingRate: number;
    /**
     * 音声データをステレオ出力するか否か
     */
    outputStereo: boolean;
};

