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
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class SynthesisMorphing<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 指定された2種類のスタイルで音声を合成、指定した割合でモーフィングした音声を得ます。 モーフィングの割合は`morph_rate`で指定でき、0.0でベースのスタイル、1.0でターゲットのスタイルに近づきます。
   *
   * @tags 音声合成
   * @name SynthesisMorphing
   * @summary 2種類のスタイルでモーフィングした音声を合成する
   * @request POST:/synthesis_morphing
   */
  synthesisMorphing = (
    query: {
      /** Base Speaker */
      base_speaker: number;
      /** Target Speaker */
      target_speaker: number;
      /**
       * Morph Rate
       * @min 0
       * @max 1
       */
      morph_rate: number;
      /** Core Version */
      core_version?: string;
    },
    data: AudioQuery,
    params: RequestParams = {},
  ) =>
    this.request<File, HTTPValidationError>({
      path: `/synthesis_morphing`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
