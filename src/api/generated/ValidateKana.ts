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

import { HTTPValidationError, ParseKanaBadRequest } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class ValidateKana<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description テキストがAquesTalk 風記法に従っているかどうかを判定します。 従っていない場合はエラーが返ります。
   *
   * @tags その他
   * @name ValidateKana
   * @summary テキストがAquesTalk 風記法に従っているか判定する
   * @request POST:/validate_kana
   */
  validateKana = (
    query: {
      /**
       * Text
       * 判定する対象の文字列
       */
      text: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<boolean, ParseKanaBadRequest | HTTPValidationError>({
      path: `/validate_kana`,
      method: "POST",
      query: query,
      format: "json",
      ...params,
    });
}
