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

import { AudioQuery, HTTPValidationError } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class AudioQueryFromPreset<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 音声合成用のクエリの初期値を得ます。ここで得られたクエリはそのまま音声合成に利用できます。各値の意味は`Schemas`を参照してください。
   *
   * @tags クエリ作成
   * @name AudioQueryFromPreset
   * @summary 音声合成用のクエリをプリセットを用いて作成する
   * @request POST:/audio_query_from_preset
   */
  audioQueryFromPreset = (
    query: {
      /** Text */
      text: string;
      /** Preset Id */
      preset_id: number;
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<AudioQuery, HTTPValidationError>({
      path: `/audio_query_from_preset`,
      method: "POST",
      query: query,
      format: "json",
      ...params,
    });
}
