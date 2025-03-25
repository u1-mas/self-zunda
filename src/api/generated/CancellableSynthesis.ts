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

export class CancellableSynthesis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 音声合成
   * @name CancellableSynthesis
   * @summary 音声合成する（キャンセル可能）
   * @request POST:/cancellable_synthesis
   */
  cancellableSynthesis = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: AudioQuery,
    params: RequestParams = {},
  ) =>
    this.request<File, HTTPValidationError>({
      path: `/cancellable_synthesis`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
