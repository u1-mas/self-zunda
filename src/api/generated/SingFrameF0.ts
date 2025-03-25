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

import { BodySingFrameF0SingFrameF0Post, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class SingFrameF0<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags クエリ編集
   * @name SingFrameF0
   * @summary 楽譜・歌唱音声合成用のクエリからフレームごとの基本周波数を得る
   * @request POST:/sing_frame_f0
   */
  singFrameF0 = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: BodySingFrameF0SingFrameF0Post,
    params: RequestParams = {},
  ) =>
    this.request<number[], HTTPValidationError>({
      path: `/sing_frame_f0`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
