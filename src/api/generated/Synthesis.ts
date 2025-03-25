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

export class Synthesis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 音声合成
   * @name Synthesis
   * @summary 音声合成する
   * @request POST:/synthesis
   */
  synthesis = (
    query: {
      /** Speaker */
      speaker: number;
      /**
       * Enable Interrogative Upspeak
       * 疑問系のテキストが与えられたら語尾を自動調整する
       * @default true
       */
      enable_interrogative_upspeak?: boolean;
      /** Core Version */
      core_version?: string;
    },
    data: AudioQuery,
    params: RequestParams = {},
  ) =>
    this.request<File, HTTPValidationError>({
      path: `/synthesis`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
