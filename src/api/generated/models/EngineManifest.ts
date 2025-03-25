/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LicenseInfo } from './LicenseInfo';
import type { SupportedFeatures } from './SupportedFeatures';
import type { UpdateInfo } from './UpdateInfo';

/**
 * エンジン自体に関する情報
 */
export type EngineManifest = {
    /**
     * マニフェストのバージョン
     */
    manifest_version: string;
    /**
     * エンジン名
     */
    name: string;
    /**
     * ブランド名
     */
    brand_name: string;
    /**
     * エンジンのUUID
     */
    uuid: string;
    /**
     * エンジンのURL
     */
    url: string;
    /**
     * エンジンのアイコンをBASE64エンコードしたもの
     */
    icon: string;
    /**
     * デフォルトのサンプリング周波数
     */
    default_sampling_rate: number;
    /**
     * エンジンのフレームレート
     */
    frame_rate: number;
    /**
     * エンジンの利用規約
     */
    terms_of_service: string;
    /**
     * エンジンのアップデート情報
     */
    update_infos: Array<UpdateInfo>;
    /**
     * 依存関係のライセンス情報
     */
    dependency_licenses: Array<LicenseInfo>;
    /**
     * エンジンが対応するvvlibのバージョン
     */
    supported_vvlib_manifest_version?: string;
    /**
     * エンジンが持つ機能
     */
    supported_features: SupportedFeatures;
};

