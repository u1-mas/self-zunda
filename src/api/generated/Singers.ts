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

import { HTTPValidationError, Speaker } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Singers<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 歌えるキャラクターの情報の一覧を返します。
   *
   * @tags その他
   * @name Singers
   * @summary Singers
   * @request GET:/singers
   */
  singers = (
    query?: {
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Speaker[], HTTPValidationError>({
      path: `/singers`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
