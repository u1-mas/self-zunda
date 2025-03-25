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

import { AccentPhrase, HTTPValidationError, ParseKanaBadRequest } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class AccentPhrases<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description テキストからアクセント句を得ます。 is_kanaが`true`のとき、テキストは次のAquesTalk 風記法で解釈されます。デフォルトは`false`です。 * 全てのカナはカタカナで記述される * アクセント句は`/`または`、`で区切る。`、`で区切った場合に限り無音区間が挿入される。 * カナの手前に`_`を入れるとそのカナは無声化される * アクセント位置を`'`で指定する。全てのアクセント句にはアクセント位置を1つ指定する必要がある。 * アクセント句末に`？`(全角)を入れることにより疑問文の発音ができる。
   *
   * @tags クエリ編集
   * @name AccentPhrases
   * @summary テキストからアクセント句を得る
   * @request POST:/accent_phrases
   */
  accentPhrases = (
    query: {
      /** Text */
      text: string;
      /** Speaker */
      speaker: number;
      /**
       * Is Kana
       * @default false
       */
      is_kana?: boolean;
      /** Core Version */
      core_version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<AccentPhrase[], ParseKanaBadRequest | HTTPValidationError>({
      path: `/accent_phrases`,
      method: "POST",
      query: query,
      format: "json",
      ...params,
    });
}
