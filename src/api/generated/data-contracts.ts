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

/**
 * AccentPhrase
 * アクセント句ごとの情報
 */
export interface AccentPhrase {
  /**
   * Moras
   * モーラのリスト
   */
  moras: Mora[];
  /**
   * Accent
   * アクセント箇所
   */
  accent: number;
  /**
   * Pause Mora
   * 後ろに無音を付けるかどうか
   */
  pause_mora?: Mora;
  /**
   * Is Interrogative
   * 疑問系かどうか
   * @default false
   */
  is_interrogative?: boolean;
}

/**
 * AudioQuery
 * 音声合成用のクエリ
 */
export interface AudioQuery {
  /**
   * Accent Phrases
   * アクセント句のリスト
   */
  accent_phrases: AccentPhrase[];
  /**
   * Speedscale
   * 全体の話速
   */
  speedScale: number;
  /**
   * Pitchscale
   * 全体の音高
   */
  pitchScale: number;
  /**
   * Intonationscale
   * 全体の抑揚
   */
  intonationScale: number;
  /**
   * Volumescale
   * 全体の音量
   */
  volumeScale: number;
  /**
   * Prephonemelength
   * 音声の前の無音時間
   */
  prePhonemeLength: number;
  /**
   * Postphonemelength
   * 音声の後の無音時間
   */
  postPhonemeLength: number;
  /**
   * Pauselength
   * 句読点などの無音時間。nullのときは無視される。デフォルト値はnull
   */
  pauseLength?: number | null;
  /**
   * Pauselengthscale
   * 句読点などの無音時間（倍率）。デフォルト値は1
   * @default 1
   */
  pauseLengthScale?: number;
  /**
   * Outputsamplingrate
   * 音声データの出力サンプリングレート
   */
  outputSamplingRate: number;
  /**
   * Outputstereo
   * 音声データをステレオ出力するか否か
   */
  outputStereo: boolean;
  /**
   * Kana
   * [読み取り専用]AquesTalk 風記法によるテキスト。音声合成用のクエリとしては無視される
   */
  kana?: string;
}

/** Body_setting_post_setting_post */
export interface BodySettingPostSettingPost {
  /** CORSの許可モード */
  cors_policy_mode: CorsPolicyMode;
  /** Allow Origin */
  allow_origin?: string;
}

/** Body_sing_frame_f0_sing_frame_f0_post */
export interface BodySingFrameF0SingFrameF0Post {
  /** 楽譜情報 */
  score: Score;
  /** フレームごとの音声合成用のクエリ */
  frame_audio_query: FrameAudioQuery;
}

/** Body_sing_frame_volume_sing_frame_volume_post */
export interface BodySingFrameVolumeSingFrameVolumePost {
  /** 楽譜情報 */
  score: Score;
  /** フレームごとの音声合成用のクエリ */
  frame_audio_query: FrameAudioQuery;
}

/**
 * CorsPolicyMode
 * CORSの許可モード
 */
export enum CorsPolicyMode {
  All = "all",
  Localapps = "localapps",
}

/**
 * EngineManifest
 * エンジン自体に関する情報
 */
export interface EngineManifest {
  /**
   * Manifest Version
   * マニフェストのバージョン
   */
  manifest_version: string;
  /**
   * Name
   * エンジン名
   */
  name: string;
  /**
   * Brand Name
   * ブランド名
   */
  brand_name: string;
  /**
   * Uuid
   * エンジンのUUID
   */
  uuid: string;
  /**
   * Url
   * エンジンのURL
   */
  url: string;
  /**
   * Icon
   * エンジンのアイコンをBASE64エンコードしたもの
   */
  icon: string;
  /**
   * Default Sampling Rate
   * デフォルトのサンプリング周波数
   */
  default_sampling_rate: number;
  /**
   * Frame Rate
   * エンジンのフレームレート
   */
  frame_rate: number;
  /**
   * Terms Of Service
   * エンジンの利用規約
   */
  terms_of_service: string;
  /**
   * Update Infos
   * エンジンのアップデート情報
   */
  update_infos: UpdateInfo[];
  /**
   * Dependency Licenses
   * 依存関係のライセンス情報
   */
  dependency_licenses: LicenseInfo[];
  /**
   * Supported Vvlib Manifest Version
   * エンジンが対応するvvlibのバージョン
   */
  supported_vvlib_manifest_version?: string;
  /** エンジンが持つ機能 */
  supported_features: SupportedFeatures;
}

/**
 * FrameAudioQuery
 * フレームごとの音声合成用のクエリ
 */
export interface FrameAudioQuery {
  /**
   * F0
   * フレームごとの基本周波数
   */
  f0: number[];
  /**
   * Volume
   * フレームごとの音量
   */
  volume: number[];
  /**
   * Phonemes
   * 音素のリスト
   */
  phonemes: FramePhoneme[];
  /**
   * Volumescale
   * 全体の音量
   */
  volumeScale: number;
  /**
   * Outputsamplingrate
   * 音声データの出力サンプリングレート
   */
  outputSamplingRate: number;
  /**
   * Outputstereo
   * 音声データをステレオ出力するか否か
   */
  outputStereo: boolean;
}

/**
 * FramePhoneme
 * 音素の情報
 */
export interface FramePhoneme {
  /**
   * Phoneme
   * 音素
   */
  phoneme: string;
  /**
   * Frame Length
   * 音素のフレーム長
   */
  frame_length: number;
  /**
   * Note Id
   * 音符のID
   */
  note_id?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/**
 * LicenseInfo
 * 依存ライブラリのライセンス情報
 */
export interface LicenseInfo {
  /**
   * Name
   * 依存ライブラリ名
   */
  name: string;
  /**
   * Version
   * 依存ライブラリのバージョン
   */
  version?: string;
  /**
   * License
   * 依存ライブラリのライセンス名
   */
  license?: string;
  /**
   * Text
   * 依存ライブラリのライセンス本文
   */
  text: string;
}

/**
 * Mora
 * モーラ（子音＋母音）ごとの情報
 */
export interface Mora {
  /**
   * Text
   * 文字
   */
  text: string;
  /**
   * Consonant
   * 子音の音素
   */
  consonant?: string;
  /**
   * Consonant Length
   * 子音の音長
   */
  consonant_length?: number;
  /**
   * Vowel
   * 母音の音素
   */
  vowel: string;
  /**
   * Vowel Length
   * 母音の音長
   */
  vowel_length: number;
  /**
   * Pitch
   * 音高
   */
  pitch: number;
}

/** MorphableTargetInfo */
export interface MorphableTargetInfo {
  /**
   * Is Morphable
   * 指定したキャラクターに対してモーフィングの可否
   */
  is_morphable: boolean;
}

/**
 * Note
 * 音符ごとの情報
 */
export interface Note {
  /**
   * Id
   * ID
   */
  id?: string | null;
  /**
   * Key
   * 音階
   */
  key?: number;
  /**
   * Frame Length
   * 音符のフレーム長
   */
  frame_length: number;
  /**
   * Lyric
   * 音符の歌詞
   */
  lyric: string;
}

/** ParseKanaBadRequest */
export interface ParseKanaBadRequest {
  /**
   * Text
   * エラーメッセージ
   */
  text: string;
  /**
   * Error Name
   * エラー名
   *
   * |name|description|
   * |---|---|
   * | UNKNOWN_TEXT | 判別できない読み仮名があります: {text} |
   * | ACCENT_TOP | 句頭にアクセントは置けません: {text} |
   * | ACCENT_TWICE | 1つのアクセント句に二つ以上のアクセントは置けません: {text} |
   * | ACCENT_NOTFOUND | アクセントを指定していないアクセント句があります: {text} |
   * | EMPTY_PHRASE | {position}番目のアクセント句が空白です |
   * | INTERROGATION_MARK_NOT_AT_END | アクセント句末以外に「？」は置けません: {text} |
   * | INFINITE_LOOP | 処理時に無限ループになってしまいました...バグ報告をお願いします。 |
   */
  error_name: string;
  /**
   * Error Args
   * エラーを起こした箇所
   */
  error_args: Record<string, string>;
}

/**
 * Preset
 * プリセット情報
 */
export interface Preset {
  /**
   * Id
   * プリセットID
   */
  id: number;
  /**
   * Name
   * プリセット名
   */
  name: string;
  /**
   * Speaker Uuid
   * キャラクターのUUID
   */
  speaker_uuid: string;
  /**
   * Style Id
   * スタイルID
   */
  style_id: number;
  /**
   * Speedscale
   * 全体の話速
   */
  speedScale: number;
  /**
   * Pitchscale
   * 全体の音高
   */
  pitchScale: number;
  /**
   * Intonationscale
   * 全体の抑揚
   */
  intonationScale: number;
  /**
   * Volumescale
   * 全体の音量
   */
  volumeScale: number;
  /**
   * Prephonemelength
   * 音声の前の無音時間
   */
  prePhonemeLength: number;
  /**
   * Postphonemelength
   * 音声の後の無音時間
   */
  postPhonemeLength: number;
  /**
   * Pauselength
   * 句読点などの無音時間
   */
  pauseLength?: number;
  /**
   * Pauselengthscale
   * 句読点などの無音時間（倍率）
   * @default 1
   */
  pauseLengthScale?: number;
}

/**
 * Score
 * 楽譜情報
 */
export interface Score {
  /**
   * Notes
   * 音符のリスト
   */
  notes: Note[];
}

/**
 * Speaker
 * キャラクター情報
 */
export interface Speaker {
  /**
   * Name
   * 名前
   */
  name: string;
  /**
   * Speaker Uuid
   * キャラクターのUUID
   */
  speaker_uuid: string;
  /**
   * Styles
   * スタイルの一覧
   */
  styles: SpeakerStyle[];
  /**
   * Version
   * キャラクターのバージョン
   */
  version: string;
  /** キャラクターの対応機能 */
  supported_features?: SpeakerSupportedFeatures;
}

/**
 * SpeakerInfo
 * キャラクターの追加情報
 */
export interface SpeakerInfo {
  /**
   * Policy
   * policy.md
   */
  policy: string;
  /**
   * Portrait
   * 立ち絵画像をbase64エンコードしたもの、あるいはURL
   */
  portrait: string;
  /**
   * Style Infos
   * スタイルの追加情報
   */
  style_infos: StyleInfo[];
}

/**
 * SpeakerStyle
 * キャラクターのスタイル情報
 */
export interface SpeakerStyle {
  /**
   * Name
   * スタイル名
   */
  name: string;
  /**
   * Id
   * スタイルID
   */
  id: number;
  /**
   * Type
   * スタイルの種類。talk:音声合成クエリの作成と音声合成が可能。singing_teacher:歌唱音声合成用のクエリの作成が可能。frame_decode:歌唱音声合成が可能。sing:歌唱音声合成用のクエリの作成と歌唱音声合成が可能。
   * @default "talk"
   */
  type?: "talk" | "singing_teacher" | "frame_decode" | "sing";
}

/**
 * SpeakerSupportedFeatures
 * キャラクターの対応機能の情報
 */
export interface SpeakerSupportedFeatures {
  /**
   * Permitted Synthesis Morphing
   * モーフィング機能への対応。'ALL' は「全て許可」、'SELF_ONLY' は「同じキャラクター内でのみ許可」、'NOTHING' は「全て禁止」
   * @default "ALL"
   */
  permitted_synthesis_morphing?: "ALL" | "SELF_ONLY" | "NOTHING";
}

/**
 * StyleInfo
 * スタイルの追加情報
 */
export interface StyleInfo {
  /**
   * Id
   * スタイルID
   */
  id: number;
  /**
   * Icon
   * このスタイルのアイコンをbase64エンコードしたもの、あるいはURL
   */
  icon: string;
  /**
   * Portrait
   * このスタイルの立ち絵画像をbase64エンコードしたもの、あるいはURL
   */
  portrait?: string;
  /**
   * Voice Samples
   * サンプル音声をbase64エンコードしたもの、あるいはURL
   */
  voice_samples: string[];
}

/**
 * SupportedDevicesInfo
 * 対応しているデバイスの情報
 */
export interface SupportedDevicesInfo {
  /**
   * Cpu
   * CPUに対応しているか
   */
  cpu: boolean;
  /**
   * Cuda
   * CUDA(Nvidia GPU)に対応しているか
   */
  cuda: boolean;
  /**
   * Dml
   * DirectML(Nvidia GPU/Radeon GPU等)に対応しているか
   */
  dml: boolean;
}

/**
 * SupportedFeatures
 * エンジンが持つ機能の一覧
 */
export interface SupportedFeatures {
  /**
   * Adjust Mora Pitch
   * モーラごとの音高の調整
   */
  adjust_mora_pitch: boolean;
  /**
   * Adjust Phoneme Length
   * 音素ごとの長さの調整
   */
  adjust_phoneme_length: boolean;
  /**
   * Adjust Speed Scale
   * 全体の話速の調整
   */
  adjust_speed_scale: boolean;
  /**
   * Adjust Pitch Scale
   * 全体の音高の調整
   */
  adjust_pitch_scale: boolean;
  /**
   * Adjust Intonation Scale
   * 全体の抑揚の調整
   */
  adjust_intonation_scale: boolean;
  /**
   * Adjust Volume Scale
   * 全体の音量の調整
   */
  adjust_volume_scale: boolean;
  /**
   * Adjust Pause Length
   * 句読点などの無音時間の調整
   */
  adjust_pause_length?: boolean;
  /**
   * Interrogative Upspeak
   * 疑問文の自動調整
   */
  interrogative_upspeak: boolean;
  /**
   * Synthesis Morphing
   * 2種類のスタイルでモーフィングした音声を合成
   */
  synthesis_morphing: boolean;
  /**
   * Sing
   * 歌唱音声合成
   */
  sing?: boolean;
  /**
   * Manage Library
   * 音声ライブラリのインストール・アンインストール
   */
  manage_library?: boolean;
  /**
   * Return Resource Url
   * キャラクター情報のリソースをURLで返送
   */
  return_resource_url?: boolean;
}

/**
 * UpdateInfo
 * エンジンのアップデート情報
 */
export interface UpdateInfo {
  /**
   * Version
   * エンジンのバージョン名
   */
  version: string;
  /**
   * Descriptions
   * アップデートの詳細についての説明
   */
  descriptions: string[];
  /**
   * Contributors
   * 貢献者名
   */
  contributors?: string[];
}

/**
 * UserDictWord
 * 辞書のコンパイルに使われる情報
 */
export interface UserDictWord {
  /**
   * Surface
   * 表層形
   */
  surface: string;
  /**
   * Priority
   * 優先度
   * @min 0
   * @max 10
   */
  priority: number;
  /**
   * Context Id
   * 文脈ID
   * @default 1348
   */
  context_id?: number;
  /**
   * Part Of Speech
   * 品詞
   */
  part_of_speech: string;
  /**
   * Part Of Speech Detail 1
   * 品詞細分類1
   */
  part_of_speech_detail_1: string;
  /**
   * Part Of Speech Detail 2
   * 品詞細分類2
   */
  part_of_speech_detail_2: string;
  /**
   * Part Of Speech Detail 3
   * 品詞細分類3
   */
  part_of_speech_detail_3: string;
  /**
   * Inflectional Type
   * 活用型
   */
  inflectional_type: string;
  /**
   * Inflectional Form
   * 活用形
   */
  inflectional_form: string;
  /**
   * Stem
   * 原形
   */
  stem: string;
  /**
   * Yomi
   * 読み
   */
  yomi: string;
  /**
   * Pronunciation
   * 発音
   */
  pronunciation: string;
  /**
   * Accent Type
   * アクセント型
   */
  accent_type: number;
  /**
   * Mora Count
   * モーラ数
   */
  mora_count?: number;
  /**
   * Accent Associative Rule
   * アクセント結合規則
   */
  accent_associative_rule: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/**
 * WordTypes
 * 品詞
 */
export enum WordTypes {
  PROPER_NOUN = "PROPER_NOUN",
  COMMON_NOUN = "COMMON_NOUN",
  VERB = "VERB",
  ADJECTIVE = "ADJECTIVE",
  SUFFIX = "SUFFIX",
}
