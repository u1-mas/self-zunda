import { VoiceConnectionStatus, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import type { Guild } from "discord.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleMessage } from "../features/textToSpeech";
import { handleInteraction } from "../handlers/interactionHandler";
import { handleVoiceStateUpdate } from "../handlers/voiceStateHandler";
import { enableTextToSpeech, getActiveChannels } from "../models/activeChannels";
import { debug, error, log, info } from "../utils/logger";
import { voicevoxClient } from "../api/voicevox-client-init";

let client: Client | null = null;

// 前回のボイスチャンネル状態を保持
interface VoiceState {
	guildId: string;
	channelId: string;
	adapterCreator: Guild["voiceAdapterCreator"];
	textChannelId: string;
}
let previousVoiceStates: VoiceState[] = [];

// VOICEVOXへの接続テスト
async function testVoicevoxConnection() {
	try {
		// バージョン情報を取得して接続テスト
		const version = await voicevoxClient.version({ parameter: {} });
		info(`VOICEVOXに接続できたのだ！バージョン: ${version}`);

		// 利用可能な話者を取得
		const speakers = await voicevoxClient.speakers({ parameter: {} });
		info(`利用可能な話者数: ${speakers.length}人なのだ！`);

		// デフォルトの話者を初期化
		const defaultSpeaker = Number(process.env.DEFAULT_SPEAKER) || 1;
		await voicevoxClient.initialize_speaker({ parameter: { speaker: defaultSpeaker } });
		info(`デフォルトの話者（ID: ${defaultSpeaker}）を初期化したのだ！`);

		return true;
	} catch (err) {
		error(
			"VOICEVOXへの接続テストに失敗したのだ:",
			err instanceof Error ? err.message : "予期せぬエラーが発生したのだ...",
		);
		return false;
	}
}

// ボイスチャンネルの状態を保存
function saveVoiceStates() {
	if (!client) return;

	previousVoiceStates = [];
	for (const guild of client.guilds.cache.values()) {
		const connection = getVoiceConnection(guild.id);
		if (connection?.joinConfig.channelId) {
			const textChannelId = getActiveChannels().get(guild.id);
			if (textChannelId) {
				previousVoiceStates.push({
					guildId: guild.id,
					channelId: connection.joinConfig.channelId,
					adapterCreator: guild.voiceAdapterCreator,
					textChannelId,
				});
			}
		}
	}
	debug(`${previousVoiceStates.length}個のボイスチャンネル状態を保存したのだ！`);
}

// 保存したボイスチャンネルに再接続
async function reconnectToVoiceChannels() {
	if (previousVoiceStates.length === 0) return;

	debug(`${previousVoiceStates.length}個のボイスチャンネルに再接続するのだ！`);
	for (const state of previousVoiceStates) {
		try {
			const connection = joinVoiceChannel({
				channelId: state.channelId,
				guildId: state.guildId,
				adapterCreator: state.adapterCreator,
			});

			// 接続が完了するまで待機
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error("接続がタイムアウトしたのだ！"));
				}, 10000);

				connection.on(VoiceConnectionStatus.Ready, () => {
					clearTimeout(timeout);
					resolve();
				});

				connection.on(VoiceConnectionStatus.Disconnected, () => {
					clearTimeout(timeout);
					reject(new Error("接続が切断されたのだ！"));
				});

				connection.on(VoiceConnectionStatus.Destroyed, () => {
					clearTimeout(timeout);
					reject(new Error("接続が破棄されたのだ！"));
				});
			});

			// テキストチャンネルの読み上げを有効化
			enableTextToSpeech(state.guildId, state.textChannelId);

			debug(`${state.guildId}のボイスチャンネルに再接続したのだ！`);
		} catch (err) {
			error(
				`${state.guildId}のボイスチャンネルへの再接続に失敗したのだ:`,
				err instanceof Error ? err.message : "予期せぬエラーが発生したのだ...",
			);
		}
	}
}

export async function initializeClient(): Promise<Client> {
	if (client) {
		// クライアントを破棄する前にボイスチャンネルの状態を保存
		saveVoiceStates();
		// イベントリスナーを全て削除
		client.removeAllListeners();
		await client.destroy();
		client = null;
		debug("古いクライアントを破棄したのだ！");
	}

	// VOICEVOXへの接続テスト
	const voicevoxConnected = await testVoicevoxConnection();
	if (!voicevoxConnected) {
		throw new Error("VOICEVOXへの接続に失敗したのだ！");
	}

	debug("新しいDiscordクライアントを作成するのだ！");
	client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildVoiceStates,
		],
	});

	const onReady = async () => {
		info("Botが準備できたのだ！");
		await reconnectToVoiceChannels();
	};

	client.on(Events.ClientReady, onReady);
	client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);
	client.on(Events.InteractionCreate, handleInteraction);
	client.on(Events.MessageCreate, handleMessage);

	return client;
}

export function getClient(): Client | null {
	return client;
}
