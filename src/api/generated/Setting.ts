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

import { BodySettingPostSettingPost, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Setting<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 設定ページを返します。
   *
   * @tags 設定
   * @name SettingGet
   * @summary Setting Get
   * @request GET:/setting
   */
  settingGet = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/setting`,
      method: "GET",
      ...params,
    });
  /**
   * @description 設定を更新します。
   *
   * @tags 設定
   * @name SettingPost
   * @summary Setting Post
   * @request POST:/setting
   */
  settingPost = (data: BodySettingPostSettingPost, params: RequestParams = {}) =>
    this.request<void, HTTPValidationError>({
      path: `/setting`,
      method: "POST",
      body: data,
      type: ContentType.UrlEncoded,
      ...params,
    });
}
