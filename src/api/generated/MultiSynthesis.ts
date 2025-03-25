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

export class MultiSynthesis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 音声合成
   * @name MultiSynthesis
   * @summary 複数まとめて音声合成する
   * @request POST:/multi_synthesis
   */
  multiSynthesis = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: AudioQuery[],
    params: RequestParams = {},
  ) =>
    this.request<File, HTTPValidationError>({
      path: `/multi_synthesis`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
