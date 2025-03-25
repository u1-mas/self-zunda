/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Mora } from './Mora';

/**
 * アクセント句ごとの情報
 */
export type AccentPhrase = {
    /**
     * モーラのリスト
     */
    moras: Array<Mora>;
    /**
     * アクセント箇所
     */
    accent: number;
    /**
     * 後ろに無音を付けるかどうか
     */
    pause_mora?: Mora;
    /**
     * 疑問系かどうか
     */
    is_interrogative?: boolean;
};

