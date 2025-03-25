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

export class AddPreset<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 新しいプリセットを追加します
   *
   * @tags その他
   * @name AddPreset
   * @summary Add Preset
   * @request POST:/add_preset
   */
  addPreset = (data: Preset, params: RequestParams = {}) =>
    this.request<number, HTTPValidationError>({
      path: `/add_preset`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
