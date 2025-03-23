/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * キャラクターの対応機能の情報
 */
export type SpeakerSupportedFeatures = {
    /**
     * モーフィング機能への対応。'ALL' は「全て許可」、'SELF_ONLY' は「同じキャラクター内でのみ許可」、'NOTHING' は「全て禁止」
     */
    permitted_synthesis_morphing?: SpeakerSupportedFeatures.permitted_synthesis_morphing;
};
export namespace SpeakerSupportedFeatures {
    /**
     * モーフィング機能への対応。'ALL' は「全て許可」、'SELF_ONLY' は「同じキャラクター内でのみ許可」、'NOTHING' は「全て禁止」
     */
    export enum permitted_synthesis_morphing {
        ALL = 'ALL',
        SELF_ONLY = 'SELF_ONLY',
        NOTHING = 'NOTHING',
    }
}

