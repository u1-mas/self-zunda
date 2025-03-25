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

import { Preset } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Presets<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description エンジンが保持しているプリセットの設定を返します
   *
   * @tags その他
   * @name GetPresets
   * @summary Get Presets
   * @request GET:/presets
   */
  getPresets = (params: RequestParams = {}) =>
    this.request<Preset[], any>({
      path: `/presets`,
      method: "GET",
      format: "json",
      ...params,
    });
}
