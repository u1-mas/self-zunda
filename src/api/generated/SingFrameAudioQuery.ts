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

import { FrameAudioQuery, HTTPValidationError, Score } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class SingFrameAudioQuery<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 歌唱音声合成用のクエリの初期値を得ます。ここで得られたクエリはそのまま歌唱音声合成に利用できます。各値の意味は`Schemas`を参照してください。
   *
   * @tags クエリ作成
   * @name SingFrameAudioQuery
   * @summary 歌唱音声合成用のクエリを作成する
   * @request POST:/sing_frame_audio_query
   */
  singFrameAudioQuery = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: Score,
    params: RequestParams = {},
  ) =>
    this.request<FrameAudioQuery, HTTPValidationError>({
      path: `/sing_frame_audio_query`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
