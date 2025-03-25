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

import { HttpClient, RequestParams } from "./http-client";

export class CoreVersions<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 利用可能なコアのバージョン一覧を取得します。
   *
   * @tags その他
   * @name CoreVersions
   * @summary Core Versions
   * @request GET:/core_versions
   */
  coreVersions = (params: RequestParams = {}) =>
    this.request<string[], any>({
      path: `/core_versions`,
      method: "GET",
      format: "json",
      ...params,
    });
}
