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

import { AccentPhrase, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class MoraPitch<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags クエリ編集
   * @name MoraPitch
   * @summary アクセント句から音高を得る
   * @request POST:/mora_pitch
   */
  moraPitch = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: AccentPhrase[],
    params: RequestParams = {},
  ) =>
    this.request<AccentPhrase[], HTTPValidationError>({
      path: `/mora_pitch`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
