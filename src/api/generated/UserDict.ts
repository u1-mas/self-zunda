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

import { UserDictWord } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class UserDict<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description ユーザー辞書に登録されている単語の一覧を返します。 単語の表層形(surface)は正規化済みの物を返します。
   *
   * @tags ユーザー辞書
   * @name GetUserDictWords
   * @summary Get User Dict Words
   * @request GET:/user_dict
   */
  getUserDictWords = (params: RequestParams = {}) =>
    this.request<Record<string, UserDictWord>, any>({
      path: `/user_dict`,
      method: "GET",
      format: "json",
      ...params,
    });
}
