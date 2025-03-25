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

import { FrameAudioQuery, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class FrameSynthesis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 歌唱音声合成を行います。
   *
   * @tags 音声合成
   * @name FrameSynthesis
   * @summary Frame Synthesis
   * @request POST:/frame_synthesis
   */
  frameSynthesis = (
    query: {
      /** Speaker */
      speaker: number;
      /** Core Version */
      core_version?: string;
    },
    data: FrameAudioQuery,
    params: RequestParams = {},
  ) =>
    this.request<File, HTTPValidationError>({
      path: `/frame_synthesis`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
