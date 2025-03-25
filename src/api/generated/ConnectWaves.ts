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
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ConnectWaves<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description base64エンコードされたwavデータを一纏めにし、wavファイルで返します。
   *
   * @tags その他
   * @name ConnectWaves
   * @summary base64エンコードされた複数のwavデータを一つに結合する
   * @request POST:/connect_waves
   */
  connectWaves = (data: string[], params: RequestParams = {}) =>
    this.request<File, HTTPValidationError>({
      path: `/connect_waves`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
