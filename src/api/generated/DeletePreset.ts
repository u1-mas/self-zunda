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

export class DeletePreset<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 既存のプリセットを削除します
   *
   * @tags その他
   * @name DeletePreset
   * @summary Delete Preset
   * @request POST:/delete_preset
   */
  deletePreset = (
    query: {
      /**
       * Id
       * 削除するプリセットのプリセットID
       */
      id: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, HTTPValidationError>({
      path: `/delete_preset`,
      method: "POST",
      query: query,
      ...params,
    });
}
