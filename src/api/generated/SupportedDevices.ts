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

import { HTTPValidationError, SupportedDevicesInfo } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class SupportedDevices<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 対応デバイスの一覧を取得します。
   *
   * @tags その他
   * @name SupportedDevices
   * @summary Supported Devices
   * @request GET:/supported_devices
   */
  supportedDevices = (
    query?: {
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<SupportedDevicesInfo, HTTPValidationError>({
      path: `/supported_devices`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
