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

export class Version<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description エンジンのバージョンを取得します。
   *
   * @tags その他
   * @name Version
   * @summary Version
   * @request GET:/version
   */
  version = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/version`,
      method: "GET",
      format: "json",
      ...params,
    });
}
