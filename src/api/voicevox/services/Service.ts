import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccentPhrase } from "../models/AccentPhrase";
import type { AudioQuery } from "../models/AudioQuery";
import type { Body_setting_post_setting_post } from "../models/Body_setting_post_setting_post";
import type { Body_sing_frame_f0_sing_frame_f0_post } from "../models/Body_sing_frame_f0_sing_frame_f0_post";
import type { Body_sing_frame_volume_sing_frame_volume_post } from "../models/Body_sing_frame_volume_sing_frame_volume_post";
import type { EngineManifest } from "../models/EngineManifest";
import type { FrameAudioQuery } from "../models/FrameAudioQuery";
import type { MorphableTargetInfo } from "../models/MorphableTargetInfo";
import type { Preset } from "../models/Preset";
import type { Score } from "../models/Score";
import type { Speaker } from "../models/Speaker";
import type { SpeakerInfo } from "../models/SpeakerInfo";
import type { SupportedDevicesInfo } from "../models/SupportedDevicesInfo";
import type { UserDictWord } from "../models/UserDictWord";
import type { WordTypes } from "../models/WordTypes";
export class Service {
	/**
	 * 音声合成用のクエリを作成する
	 * 音声合成用のクエリの初期値を得ます。ここで得られたクエリはそのまま音声合成に利用できます。各値の意味は`Schemas`を参照してください。
	 * @param text
	 * @param speaker
	 * @param coreVersion
	 * @returns AudioQuery Successful Response
	 * @throws ApiError
	 */
	public static audioQuery(
		text: string,
		speaker: number,
		coreVersion?: string,
	): CancelablePromise<AudioQuery> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/audio_query",
			query: {
				text: text,
				speaker: speaker,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 音声合成用のクエリをプリセットを用いて作成する
	 * 音声合成用のクエリの初期値を得ます。ここで得られたクエリはそのまま音声合成に利用できます。各値の意味は`Schemas`を参照してください。
	 * @param text
	 * @param presetId
	 * @param coreVersion
	 * @returns AudioQuery Successful Response
	 * @throws ApiError
	 */
	public static audioQueryFromPreset(
		text: string,
		presetId: number,
		coreVersion?: string,
	): CancelablePromise<AudioQuery> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/audio_query_from_preset",
			query: {
				text: text,
				preset_id: presetId,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * テキストからアクセント句を得る
	 * テキストからアクセント句を得ます。
	 * is_kanaが`true`のとき、テキストは次のAquesTalk 風記法で解釈されます。デフォルトは`false`です。
	 * * 全てのカナはカタカナで記述される
	 * * アクセント句は`/`または`、`で区切る。`、`で区切った場合に限り無音区間が挿入される。
	 * * カナの手前に`_`を入れるとそのカナは無声化される
	 * * アクセント位置を`'`で指定する。全てのアクセント句にはアクセント位置を1つ指定する必要がある。
	 * * アクセント句末に`？`(全角)を入れることにより疑問文の発音ができる。
	 * @param text
	 * @param speaker
	 * @param isKana
	 * @param coreVersion
	 * @returns AccentPhrase Successful Response
	 * @throws ApiError
	 */
	public static accentPhrases(
		text: string,
		speaker: number,
		isKana = false,
		coreVersion?: string,
	): CancelablePromise<Array<AccentPhrase>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/accent_phrases",
			query: {
				text: text,
				speaker: speaker,
				is_kana: isKana,
				core_version: coreVersion,
			},
			errors: {
				400: `読み仮名のパースに失敗`,
				422: `Validation Error`,
			},
		});
	}
	/**
	 * アクセント句から音高・音素長を得る
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns AccentPhrase Successful Response
	 * @throws ApiError
	 */
	public static moraData(
		speaker: number,
		requestBody: Array<AccentPhrase>,
		coreVersion?: string,
	): CancelablePromise<Array<AccentPhrase>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/mora_data",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * アクセント句から音素長を得る
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns AccentPhrase Successful Response
	 * @throws ApiError
	 */
	public static moraLength(
		speaker: number,
		requestBody: Array<AccentPhrase>,
		coreVersion?: string,
	): CancelablePromise<Array<AccentPhrase>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/mora_length",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * アクセント句から音高を得る
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns AccentPhrase Successful Response
	 * @throws ApiError
	 */
	public static moraPitch(
		speaker: number,
		requestBody: Array<AccentPhrase>,
		coreVersion?: string,
	): CancelablePromise<Array<AccentPhrase>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/mora_pitch",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 音声合成する
	 * @param speaker
	 * @param requestBody
	 * @param enableInterrogativeUpspeak 疑問系のテキストが与えられたら語尾を自動調整する
	 * @param coreVersion
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static synthesis(
		speaker: number,
		requestBody: AudioQuery,
		enableInterrogativeUpspeak = true,
		coreVersion?: string,
	): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/synthesis",
			query: {
				speaker: speaker,
				enable_interrogative_upspeak: enableInterrogativeUpspeak,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 音声合成する（キャンセル可能）
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static cancellableSynthesis(
		speaker: number,
		requestBody: AudioQuery,
		coreVersion?: string,
	): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/cancellable_synthesis",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 複数まとめて音声合成する
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static multiSynthesis(
		speaker: number,
		requestBody: Array<AudioQuery>,
		coreVersion?: string,
	): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/multi_synthesis",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 歌唱音声合成用のクエリを作成する
	 * 歌唱音声合成用のクエリの初期値を得ます。ここで得られたクエリはそのまま歌唱音声合成に利用できます。各値の意味は`Schemas`を参照してください。
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns FrameAudioQuery Successful Response
	 * @throws ApiError
	 */
	public static singFrameAudioQuery(
		speaker: number,
		requestBody: Score,
		coreVersion?: string,
	): CancelablePromise<FrameAudioQuery> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/sing_frame_audio_query",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 楽譜・歌唱音声合成用のクエリからフレームごとの基本周波数を得る
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns number Successful Response
	 * @throws ApiError
	 */
	public static singFrameF0(
		speaker: number,
		requestBody: Body_sing_frame_f0_sing_frame_f0_post,
		coreVersion?: string,
	): CancelablePromise<Array<number>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/sing_frame_f0",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 楽譜・歌唱音声合成用のクエリからフレームごとの音量を得る
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns number Successful Response
	 * @throws ApiError
	 */
	public static singFrameVolume(
		speaker: number,
		requestBody: Body_sing_frame_volume_sing_frame_volume_post,
		coreVersion?: string,
	): CancelablePromise<Array<number>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/sing_frame_volume",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Frame Synthesis
	 * 歌唱音声合成を行います。
	 * @param speaker
	 * @param requestBody
	 * @param coreVersion
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static frameSynthesis(
		speaker: number,
		requestBody: FrameAudioQuery,
		coreVersion?: string,
	): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/frame_synthesis",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * base64エンコードされた複数のwavデータを一つに結合する
	 * base64エンコードされたwavデータを一纏めにし、wavファイルで返します。
	 * @param requestBody
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static connectWaves(requestBody: Array<string>): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/connect_waves",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * テキストがAquesTalk 風記法に従っているか判定する
	 * テキストがAquesTalk 風記法に従っているかどうかを判定します。
	 * 従っていない場合はエラーが返ります。
	 * @param text 判定する対象の文字列
	 * @returns boolean Successful Response
	 * @throws ApiError
	 */
	public static validateKana(text: string): CancelablePromise<boolean> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/validate_kana",
			query: {
				text: text,
			},
			errors: {
				400: `テキストが不正です`,
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Initialize Speaker
	 * 指定されたスタイルを初期化します。
	 * 実行しなくても他のAPIは使用できますが、初回実行時に時間がかかることがあります。
	 * @param speaker
	 * @param skipReinit 既に初期化済みのスタイルの再初期化をスキップするかどうか
	 * @param coreVersion
	 * @returns void
	 * @throws ApiError
	 */
	public static initializeSpeaker(
		speaker: number,
		skipReinit = false,
		coreVersion?: string,
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/initialize_speaker",
			query: {
				speaker: speaker,
				skip_reinit: skipReinit,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Is Initialized Speaker
	 * 指定されたスタイルが初期化されているかどうかを返します。
	 * @param speaker
	 * @param coreVersion
	 * @returns boolean Successful Response
	 * @throws ApiError
	 */
	public static isInitializedSpeaker(
		speaker: number,
		coreVersion?: string,
	): CancelablePromise<boolean> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/is_initialized_speaker",
			query: {
				speaker: speaker,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Supported Devices
	 * 対応デバイスの一覧を取得します。
	 * @param coreVersion
	 * @returns SupportedDevicesInfo Successful Response
	 * @throws ApiError
	 */
	public static supportedDevices(coreVersion?: string): CancelablePromise<SupportedDevicesInfo> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/supported_devices",
			query: {
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 指定したスタイルに対してエンジン内のキャラクターがモーフィングが可能か判定する
	 * 指定されたベーススタイルに対してエンジン内の各キャラクターがモーフィング機能を利用可能か返します。
	 * モーフィングの許可/禁止は`/speakers`の`speaker.supported_features.synthesis_morphing`に記載されています。
	 * プロパティが存在しない場合は、モーフィングが許可されているとみなします。
	 * 返り値のスタイルIDはstring型なので注意。
	 * @param requestBody
	 * @param coreVersion
	 * @returns MorphableTargetInfo Successful Response
	 * @throws ApiError
	 */
	public static morphableTargets(
		requestBody: Array<number>,
		coreVersion?: string,
	): CancelablePromise<Array<Record<string, MorphableTargetInfo>>> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/morphable_targets",
			query: {
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * 2種類のスタイルでモーフィングした音声を合成する
	 * 指定された2種類のスタイルで音声を合成、指定した割合でモーフィングした音声を得ます。
	 * モーフィングの割合は`morph_rate`で指定でき、0.0でベースのスタイル、1.0でターゲットのスタイルに近づきます。
	 * @param baseSpeaker
	 * @param targetSpeaker
	 * @param morphRate
	 * @param requestBody
	 * @param coreVersion
	 * @returns binary Successful Response
	 * @throws ApiError
	 */
	public static synthesisMorphing(
		baseSpeaker: number,
		targetSpeaker: number,
		morphRate: number,
		requestBody: AudioQuery,
		coreVersion?: string,
	): CancelablePromise<Blob> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/synthesis_morphing",
			query: {
				base_speaker: baseSpeaker,
				target_speaker: targetSpeaker,
				morph_rate: morphRate,
				core_version: coreVersion,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Presets
	 * エンジンが保持しているプリセットの設定を返します
	 * @returns Preset プリセットのリスト
	 * @throws ApiError
	 */
	public static getPresets(): CancelablePromise<Array<Preset>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/presets",
		});
	}
	/**
	 * Add Preset
	 * 新しいプリセットを追加します
	 * @param requestBody
	 * @returns number 追加したプリセットのプリセットID
	 * @throws ApiError
	 */
	public static addPreset(requestBody: Preset): CancelablePromise<number> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/add_preset",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Update Preset
	 * 既存のプリセットを更新します
	 * @param requestBody
	 * @returns number 更新したプリセットのプリセットID
	 * @throws ApiError
	 */
	public static updatePreset(requestBody: Preset): CancelablePromise<number> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/update_preset",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Delete Preset
	 * 既存のプリセットを削除します
	 * @param id 削除するプリセットのプリセットID
	 * @returns void
	 * @throws ApiError
	 */
	public static deletePreset(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/delete_preset",
			query: {
				id: id,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Speakers
	 * 喋れるキャラクターの情報の一覧を返します。
	 * @param coreVersion
	 * @returns Speaker Successful Response
	 * @throws ApiError
	 */
	public static speakers(coreVersion?: string): CancelablePromise<Array<Speaker>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/speakers",
			query: {
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Speaker Info
	 * UUID で指定された喋れるキャラクターの情報を返します。
	 * 画像や音声はresource_formatで指定した形式で返されます。
	 * @param speakerUuid
	 * @param resourceFormat
	 * @param coreVersion
	 * @returns SpeakerInfo Successful Response
	 * @throws ApiError
	 */
	public static speakerInfo(
		speakerUuid: string,
		resourceFormat: "base64" | "url" = "base64",
		coreVersion?: string,
	): CancelablePromise<SpeakerInfo> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/speaker_info",
			query: {
				speaker_uuid: speakerUuid,
				resource_format: resourceFormat,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Singers
	 * 歌えるキャラクターの情報の一覧を返します。
	 * @param coreVersion
	 * @returns Speaker Successful Response
	 * @throws ApiError
	 */
	public static singers(coreVersion?: string): CancelablePromise<Array<Speaker>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/singers",
			query: {
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Singer Info
	 * UUID で指定された歌えるキャラクターの情報を返します。
	 * 画像や音声はresource_formatで指定した形式で返されます。
	 * @param speakerUuid
	 * @param resourceFormat
	 * @param coreVersion
	 * @returns SpeakerInfo Successful Response
	 * @throws ApiError
	 */
	public static singerInfo(
		speakerUuid: string,
		resourceFormat: "base64" | "url" = "base64",
		coreVersion?: string,
	): CancelablePromise<SpeakerInfo> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/singer_info",
			query: {
				speaker_uuid: speakerUuid,
				resource_format: resourceFormat,
				core_version: coreVersion,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get User Dict Words
	 * ユーザー辞書に登録されている単語の一覧を返します。
	 * 単語の表層形(surface)は正規化済みの物を返します。
	 * @returns UserDictWord 単語のUUIDとその詳細
	 * @throws ApiError
	 */
	public static getUserDictWords(): CancelablePromise<Record<string, UserDictWord>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/user_dict",
		});
	}
	/**
	 * Add User Dict Word
	 * ユーザー辞書に言葉を追加します。
	 * @param surface 言葉の表層形
	 * @param pronunciation 言葉の発音（カタカナ）
	 * @param accentType アクセント型（音が下がる場所を指す）
	 * @param wordType PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）のいずれか
	 * @param priority 単語の優先度（0から10までの整数）。数字が大きいほど優先度が高くなる。1から9までの値を指定することを推奨
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static addUserDictWord(
		surface: string,
		pronunciation: string,
		accentType: number,
		wordType?: WordTypes,
		priority?: number,
	): CancelablePromise<string> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/user_dict_word",
			query: {
				surface: surface,
				pronunciation: pronunciation,
				accent_type: accentType,
				word_type: wordType,
				priority: priority,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Rewrite User Dict Word
	 * ユーザー辞書に登録されている言葉を更新します。
	 * @param wordUuid 更新する言葉のUUID
	 * @param surface 言葉の表層形
	 * @param pronunciation 言葉の発音（カタカナ）
	 * @param accentType アクセント型（音が下がる場所を指す）
	 * @param wordType PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）のいずれか
	 * @param priority 単語の優先度（0から10までの整数）。数字が大きいほど優先度が高くなる。1から9までの値を指定することを推奨。
	 * @returns void
	 * @throws ApiError
	 */
	public static rewriteUserDictWord(
		wordUuid: string,
		surface: string,
		pronunciation: string,
		accentType: number,
		wordType?: WordTypes,
		priority?: number,
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/user_dict_word/{word_uuid}",
			path: {
				word_uuid: wordUuid,
			},
			query: {
				surface: surface,
				pronunciation: pronunciation,
				accent_type: accentType,
				word_type: wordType,
				priority: priority,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Delete User Dict Word
	 * ユーザー辞書に登録されている言葉を削除します。
	 * @param wordUuid 削除する言葉のUUID
	 * @returns void
	 * @throws ApiError
	 */
	public static deleteUserDictWord(wordUuid: string): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/user_dict_word/{word_uuid}",
			path: {
				word_uuid: wordUuid,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Import User Dict Words
	 * 他のユーザー辞書をインポートします。
	 * @param override 重複したエントリがあった場合、上書きするかどうか
	 * @param requestBody
	 * @returns void
	 * @throws ApiError
	 */
	public static importUserDictWords(
		override: boolean,
		requestBody: Record<string, UserDictWord>,
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/import_user_dict",
			query: {
				override: override,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Version
	 * エンジンのバージョンを取得します。
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static version(): CancelablePromise<string> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/version",
		});
	}
	/**
	 * Core Versions
	 * 利用可能なコアのバージョン一覧を取得します。
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static coreVersions(): CancelablePromise<Array<string>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/core_versions",
		});
	}
	/**
	 * Engine Manifest
	 * エンジンマニフェストを取得します。
	 * @returns EngineManifest Successful Response
	 * @throws ApiError
	 */
	public static engineManifest(): CancelablePromise<EngineManifest> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/engine_manifest",
		});
	}
	/**
	 * Setting Get
	 * 設定ページを返します。
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static settingGet(): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/setting",
		});
	}
	/**
	 * Setting Post
	 * 設定を更新します。
	 * @param formData
	 * @returns void
	 * @throws ApiError
	 */
	public static settingPost(formData: Body_setting_post_setting_post): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/setting",
			formData: formData,
			mediaType: "application/x-www-form-urlencoded",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Portal Page
	 * ポータルページを返します。
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static getPortalPage(): CancelablePromise<string> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/",
		});
	}
}
