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

export class IsInitializedSpeaker<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 指定されたスタイルが初期化されているかどうかを返します。
   *
   * @tags その他
   * @name IsInitializedSpeaker
   * @summary Is Initialized Speaker
   * @request GET:/is_initialized_speaker
   */
  isInitializedSpeaker = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<boolean, HTTPValidationError>({
      path: `/is_initialized_speaker`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
