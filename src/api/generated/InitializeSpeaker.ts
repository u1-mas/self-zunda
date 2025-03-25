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

import { HTTPValidationError } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class InitializeSpeaker<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 指定されたスタイルを初期化します。 実行しなくても他のAPIは使用できますが、初回実行時に時間がかかることがあります。
   *
   * @tags その他
   * @name InitializeSpeaker
   * @summary Initialize Speaker
   * @request POST:/initialize_speaker
   */
  initializeSpeaker = (
    query: {
      /** Speaker */
      speaker: number;
      /**
       * Skip Reinit
       * 既に初期化済みのスタイルの再初期化をスキップするかどうか
       * @default false
       */
      skip_reinit?: boolean;
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, HTTPValidationError>({
      path: `/initialize_speaker`,
      method: "POST",
      query: query,
      ...params,
    });
}
