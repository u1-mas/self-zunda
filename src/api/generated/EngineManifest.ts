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

import { EngineManifest } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class EngineManifest<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description エンジンマニフェストを取得します。
   *
   * @tags その他
   * @name EngineManifest
   * @summary Engine Manifest
   * @request GET:/engine_manifest
   */
  engineManifest = (params: RequestParams = {}) =>
    this.request<EngineManifest, any>({
      path: `/engine_manifest`,
      method: "GET",
      format: "json",
      ...params,
    });
}
