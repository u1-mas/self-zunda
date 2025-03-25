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

import { HTTPValidationError, UserDictWord } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ImportUserDict<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 他のユーザー辞書をインポートします。
   *
   * @tags ユーザー辞書
   * @name ImportUserDictWords
   * @summary Import User Dict Words
   * @request POST:/import_user_dict
   */
  importUserDictWords = (
    query: {
      /**
       * Override
       * 重複したエントリがあった場合、上書きするかどうか
       */
      override: boolean;
    },
    data: Record<string, UserDictWord>,
    params: RequestParams = {},
  ) =>
    this.request<void, HTTPValidationError>({
      path: `/import_user_dict`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
