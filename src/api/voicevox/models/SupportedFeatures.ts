/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * エンジンが持つ機能の一覧
 */
export type SupportedFeatures = {
    /**
     * モーラごとの音高の調整
     */
    adjust_mora_pitch: boolean;
    /**
     * 音素ごとの長さの調整
     */
    adjust_phoneme_length: boolean;
    /**
     * 全体の話速の調整
     */
    adjust_speed_scale: boolean;
    /**
     * 全体の音高の調整
     */
    adjust_pitch_scale: boolean;
    /**
     * 全体の抑揚の調整
     */
    adjust_intonation_scale: boolean;
    /**
     * 全体の音量の調整
     */
    adjust_volume_scale: boolean;
    /**
     * 句読点などの無音時間の調整
     */
    adjust_pause_length?: boolean;
    /**
     * 疑問文の自動調整
     */
    interrogative_upspeak: boolean;
    /**
     * 2種類のスタイルでモーフィングした音声を合成
     */
    synthesis_morphing: boolean;
    /**
     * 歌唱音声合成
     */
    sing?: boolean;
    /**
     * 音声ライブラリのインストール・アンインストール
     */
    manage_library?: boolean;
    /**
     * キャラクター情報のリソースをURLで返送
     */
    return_resource_url?: boolean;
};

