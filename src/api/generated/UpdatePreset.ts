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

import { HTTPValidationError, Preset } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class UpdatePreset<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 既存のプリセットを更新します
   *
   * @tags その他
   * @name UpdatePreset
   * @summary Update Preset
   * @request POST:/update_preset
   */
  updatePreset = (data: Preset, params: RequestParams = {}) =>
    this.request<number, HTTPValidationError>({
      path: `/update_preset`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
