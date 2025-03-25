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

import { HTTPValidationError, WordTypes } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class UserDictWord<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description ユーザー辞書に言葉を追加します。
   *
   * @tags ユーザー辞書
   * @name AddUserDictWord
   * @summary Add User Dict Word
   * @request POST:/user_dict_word
   */
  addUserDictWord = (
    query: {
      /**
       * Surface
       * 言葉の表層形
       */
      surface: string;
      /**
       * Pronunciation
       * 言葉の発音（カタカナ）
       */
      pronunciation: string;
      /**
       * Accent Type
       * アクセント型（音が下がる場所を指す）
       */
      accent_type: number;
      /** PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）のいずれか */
      word_type?: WordTypes;
      /**
       * Priority
       * 単語の優先度（0から10までの整数）。数字が大きいほど優先度が高くなる。1から9までの値を指定することを推奨
       * @min 0
       * @max 10
       */
      priority?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<string, HTTPValidationError>({
      path: `/user_dict_word`,
      method: "POST",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description ユーザー辞書に登録されている言葉を更新します。
   *
   * @tags ユーザー辞書
   * @name RewriteUserDictWord
   * @summary Rewrite User Dict Word
   * @request PUT:/user_dict_word/{word_uuid}
   */
  rewriteUserDictWord = (
    wordUuid: string,
    query: {
      /**
       * Surface
       * 言葉の表層形
       */
      surface: string;
      /**
       * Pronunciation
       * 言葉の発音（カタカナ）
       */
      pronunciation: string;
      /**
       * Accent Type
       * アクセント型（音が下がる場所を指す）
       */
      accent_type: number;
      /** PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）のいずれか */
      word_type?: WordTypes;
      /**
       * Priority
       * 単語の優先度（0から10までの整数）。数字が大きいほど優先度が高くなる。1から9までの値を指定することを推奨。
       * @min 0
       * @max 10
       */
      priority?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, HTTPValidationError>({
      path: `/user_dict_word/${wordUuid}`,
      method: "PUT",
      query: query,
      ...params,
    });
  /**
   * @description ユーザー辞書に登録されている言葉を削除します。
   *
   * @tags ユーザー辞書
   * @name DeleteUserDictWord
   * @summary Delete User Dict Word
   * @request DELETE:/user_dict_word/{word_uuid}
   */
  deleteUserDictWord = (wordUuid: string, params: RequestParams = {}) =>
    this.request<void, HTTPValidationError>({
      path: `/user_dict_word/${wordUuid}`,
      method: "DELETE",
      ...params,
    });
}
