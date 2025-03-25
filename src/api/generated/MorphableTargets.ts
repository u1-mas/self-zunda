/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { HTTPValidationError, MorphableTargetInfo } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class MorphableTargets<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 指定されたベーススタイルに対してエンジン内の各キャラクターがモーフィング機能を利用可能か返します。 モーフィングの許可/禁止は`/speakers`の`speaker.supported_features.synthesis_morphing`に記載されています。 プロパティが存在しない場合は、モーフィングが許可されているとみなします。 返り値のスタイルIDはstring型なので注意。
   *
   * @tags 音声合成
   * @name MorphableTargets
   * @summary 指定したスタイルに対してエンジン内のキャラクターがモーフィングが可能か判定する
   * @request POST:/morphable_targets
   */
  morphableTargets = (
    data: number[],
    query?: {
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Record<string, MorphableTargetInfo>[], HTTPValidationError>({
      path: `/morphable_targets`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
