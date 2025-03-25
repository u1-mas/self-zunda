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

import { BodySingFrameVolumeSingFrameVolumePost, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class SingFrameVolume<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags クエリ編集
   * @name SingFrameVolume
   * @summary 楽譜・歌唱音声合成用のクエリからフレームごとの音量を得る
   * @request POST:/sing_frame_volume
   */
  singFrameVolume = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: BodySingFrameVolumeSingFrameVolumePost,
    params: RequestParams = {},
  ) =>
    this.request<number[], HTTPValidationError>({
      path: `/sing_frame_volume`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
