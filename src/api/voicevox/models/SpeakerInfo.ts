/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StyleInfo } from './StyleInfo';
/**
 * キャラクターの追加情報
 */
export type SpeakerInfo = {
    /**
     * policy.md
     */
    policy: string;
    /**
     * 立ち絵画像をbase64エンコードしたもの、あるいはURL
     */
    portrait: string;
    /**
     * スタイルの追加情報
     */
    style_infos: Array<StyleInfo>;
};

