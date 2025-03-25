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

import { HTTPValidationError, SpeakerInfo } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class SingerInfo<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description UUID で指定された歌えるキャラクターの情報を返します。 画像や音声はresource_formatで指定した形式で返されます。
   *
   * @tags その他
   * @name SingerInfo
   * @summary Singer Info
   * @request GET:/singer_info
   */
  singerInfo = (
    query: {
      /** Speaker Uuid */
      speaker_uuid: string;
      /**
       * Resource Format
       * @default "base64"
       */
      resource_format?: "base64" | "url";
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<SpeakerInfo, HTTPValidationError>({
      path: `/singer_info`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
