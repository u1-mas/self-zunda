/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

// APIクライアント
export * from './http-client';

// データ型
export * from './data-contracts';

// APIクライアントクラス (データ型と衝突しないようにリネームしてエクスポート)
export { AudioQuery as AudioQueryApi } from './AudioQuery';
export { Synthesis as SynthesisApi } from './Synthesis';
export { Speakers as SpeakersApi } from './Speakers';
export { Version as VersionApi } from './Version';
export { InitializeSpeaker as InitializeSpeakerApi } from './InitializeSpeaker';

// その他のAPIクライアントクラス
export { AccentPhrases } from './AccentPhrases';
export { AddPreset } from './AddPreset';
export { AudioQueryFromPreset } from './AudioQueryFromPreset';
export { CancellableSynthesis } from './CancellableSynthesis';
export { ConnectWaves } from './ConnectWaves';
export { CoreVersions } from './CoreVersions';
export { DeletePreset } from './DeletePreset';
export { EngineManifest as EngineManifestApi } from './EngineManifest';
export { FrameSynthesis } from './FrameSynthesis';
export { ImportUserDict } from './ImportUserDict';
export { IsInitializedSpeaker } from './IsInitializedSpeaker';
export { MoraData } from './MoraData';
export { MoraLength } from './MoraLength';
export { MoraPitch } from './MoraPitch';
export { MorphableTargets } from './MorphableTargets';
export { MultiSynthesis } from './MultiSynthesis';
export { Presets } from './Presets';
export { Setting } from './Setting';
export { SingFrameAudioQuery } from './SingFrameAudioQuery';
export { SingFrameF0 } from './SingFrameF0';
export { SingFrameVolume } from './SingFrameVolume';
export { SingerInfo } from './SingerInfo';
export { Singers } from './Singers';
export { SpeakerInfo as SpeakerInfoApi } from './SpeakerInfo';
export { SupportedDevices } from './SupportedDevices';
export { SynthesisMorphing } from './SynthesisMorphing';
export { UpdatePreset } from './UpdatePreset';
export { UserDict } from './UserDict';
export { UserDictWord as UserDictWordApi } from './UserDictWord';
export { ValidateKana } from './ValidateKana'; 