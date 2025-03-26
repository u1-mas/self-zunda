// 読み上げ速度のオプション一覧
export const SPEED_OPTIONS = [
	{ value: 0.75, label: "遅い", description: "遅めの読み上げ速度" },
	{ value: 1.0, label: "普通", description: "標準的な読み上げ速度" },
	{ value: 1.25, label: "速い", description: "速めの読み上げ速度" },
	{ value: 1.5, label: "かなり速い", description: "かなり速い読み上げ速度" },
];

// 「声」のオプション一覧
// ID: VOICEVOXでのスピーカーID
// NAME: 日本語での表示名
// STYLE: スタイルの説明
export const VOICES = [
	// 四国めたん
	{ id: 2, name: "四国めたん", style: "ノーマル" },
	{ id: 0, name: "四国めたん", style: "あまあま" },
	{ id: 6, name: "四国めたん", style: "ツンツン" },
	{ id: 4, name: "四国めたん", style: "セクシー" },
	{ id: 36, name: "四国めたん", style: "ささやき" },
	{ id: 37, name: "四国めたん", style: "ヒソヒソ" },

	// ずんだもん
	{ id: 3, name: "ずんだもん", style: "ノーマル" },
	{ id: 1, name: "ずんだもん", style: "あまあま" },
	{ id: 7, name: "ずんだもん", style: "ツンツン" },
	{ id: 5, name: "ずんだもん", style: "セクシー" },
	{ id: 22, name: "ずんだもん", style: "ささやき" },
	{ id: 38, name: "ずんだもん", style: "ヒソヒソ" },
	{ id: 75, name: "ずんだもん", style: "ヘロヘロ" },
	{ id: 76, name: "ずんだもん", style: "なみだめ" },

	// 春日部つむぎ
	{ id: 8, name: "春日部つむぎ", style: "ノーマル" },

	// 雨晴はう
	{ id: 10, name: "雨晴はう", style: "ノーマル" },

	// 波音リツ
	{ id: 9, name: "波音リツ", style: "ノーマル" },
	{ id: 65, name: "波音リツ", style: "クイーン" },

	// 玄野武宏
	{ id: 11, name: "玄野武宏", style: "ノーマル" },
	{ id: 39, name: "玄野武宏", style: "喜び" },
	{ id: 40, name: "玄野武宏", style: "ツンギレ" },
	{ id: 41, name: "玄野武宏", style: "悲しみ" },

	// 白上虎太郎
	{ id: 12, name: "白上虎太郎", style: "ふつう" },
	{ id: 32, name: "白上虎太郎", style: "わーい" },
	{ id: 33, name: "白上虎太郎", style: "びくびく" },
	{ id: 34, name: "白上虎太郎", style: "おこ" },
	{ id: 35, name: "白上虎太郎", style: "びえーん" },

	// 青山龍星
	{ id: 13, name: "青山龍星", style: "ノーマル" },
	{ id: 81, name: "青山龍星", style: "熱血" },
	{ id: 82, name: "青山龍星", style: "不機嫌" },
	{ id: 83, name: "青山龍星", style: "喜び" },
	{ id: 84, name: "青山龍星", style: "しっとり" },
	{ id: 85, name: "青山龍星", style: "かなしみ" },
	{ id: 86, name: "青山龍星", style: "囁き" },

	// 冥鳴ひまり
	{ id: 14, name: "冥鳴ひまり", style: "ノーマル" },

	// 九州そら
	{ id: 16, name: "九州そら", style: "ノーマル" },
	{ id: 15, name: "九州そら", style: "あまあま" },
	{ id: 18, name: "九州そら", style: "ツンツン" },
	{ id: 17, name: "九州そら", style: "セクシー" },
	{ id: 19, name: "九州そら", style: "ささやき" },

	// もち子さん
	{ id: 20, name: "もち子さん", style: "ノーマル" },
	{ id: 66, name: "もち子さん", style: "セクシー／あん子" },
	{ id: 77, name: "もち子さん", style: "泣き" },
	{ id: 78, name: "もち子さん", style: "怒り" },
	{ id: 79, name: "もち子さん", style: "喜び" },
	{ id: 80, name: "もち子さん", style: "のんびり" },

	// 剣崎雌雄
	{ id: 21, name: "剣崎雌雄", style: "ノーマル" },

	// WhiteCUL
	{ id: 23, name: "WhiteCUL", style: "ノーマル" },
	{ id: 24, name: "WhiteCUL", style: "たのしい" },
	{ id: 25, name: "WhiteCUL", style: "かなしい" },
	{ id: 26, name: "WhiteCUL", style: "びえーん" },

	// 後鬼
	{ id: 27, name: "後鬼", style: "人間ver." },
	{ id: 28, name: "後鬼", style: "ぬいぐるみver." },
	{ id: 87, name: "後鬼", style: "人間（怒り）ver." },
	{ id: 88, name: "後鬼", style: "鬼ver." },

	// No.7
	{ id: 29, name: "No.7", style: "ノーマル" },
	{ id: 30, name: "No.7", style: "アナウンス" },
	{ id: 31, name: "No.7", style: "読み聞かせ" },

	// ちび式じい
	{ id: 42, name: "ちび式じい", style: "ノーマル" },

	// 櫻歌ミコ
	{ id: 43, name: "櫻歌ミコ", style: "ノーマル" },
	{ id: 44, name: "櫻歌ミコ", style: "第二形態" },
	{ id: 45, name: "櫻歌ミコ", style: "ロリ" },

	// 小夜/SAYO
	{ id: 46, name: "小夜/SAYO", style: "ノーマル" },

	// ナースロボ＿タイプＴ
	{ id: 47, name: "ナースロボ＿タイプＴ", style: "ノーマル" },
	{ id: 48, name: "ナースロボ＿タイプＴ", style: "楽々" },
	{ id: 49, name: "ナースロボ＿タイプＴ", style: "恐怖" },
	{ id: 50, name: "ナースロボ＿タイプＴ", style: "内緒話" },

	// †聖騎士 紅桜†
	{ id: 51, name: "†聖騎士 紅桜†", style: "ノーマル" },

	// 雀松朱司
	{ id: 52, name: "雀松朱司", style: "ノーマル" },

	// 麒ヶ島宗麟
	{ id: 53, name: "麒ヶ島宗麟", style: "ノーマル" },

	// 春歌ナナ
	{ id: 54, name: "春歌ナナ", style: "ノーマル" },

	// 猫使アル
	{ id: 55, name: "猫使アル", style: "ノーマル" },
	{ id: 56, name: "猫使アル", style: "おちつき" },
	{ id: 57, name: "猫使アル", style: "うきうき" },

	// 猫使ビィ
	{ id: 58, name: "猫使ビィ", style: "ノーマル" },
	{ id: 59, name: "猫使ビィ", style: "おちつき" },
	{ id: 60, name: "猫使ビィ", style: "人見知り" },

	// 中国うさぎ
	{ id: 61, name: "中国うさぎ", style: "ノーマル" },
	{ id: 62, name: "中国うさぎ", style: "おどろき" },
	{ id: 63, name: "中国うさぎ", style: "こわがり" },
	{ id: 64, name: "中国うさぎ", style: "へろへろ" },

	// 栗田まろん
	{ id: 67, name: "栗田まろん", style: "ノーマル" },

	// あいえるたん
	{ id: 68, name: "あいえるたん", style: "ノーマル" },

	// 満別花丸
	{ id: 69, name: "満別花丸", style: "ノーマル" },
	{ id: 70, name: "満別花丸", style: "元気" },
	{ id: 71, name: "満別花丸", style: "ささやき" },
	{ id: 72, name: "満別花丸", style: "ぶりっ子" },
	{ id: 73, name: "満別花丸", style: "ボーイ" },

	// 琴詠ニア
	{ id: 74, name: "琴詠ニア", style: "ノーマル" },

	// Voidoll
	{ id: 89, name: "Voidoll", style: "ノーマル" },

	// ぞん子
	{ id: 90, name: "ぞん子", style: "ノーマル" },
	{ id: 91, name: "ぞん子", style: "低血圧" },
	{ id: 92, name: "ぞん子", style: "覚醒" },
	{ id: 93, name: "ぞん子", style: "実況風" },

	// 中部つるぎ
	{ id: 94, name: "中部つるぎ", style: "ノーマル" },
	{ id: 95, name: "中部つるぎ", style: "怒り" },
	{ id: 96, name: "中部つるぎ", style: "ヒソヒソ" },
	{ id: 97, name: "中部つるぎ", style: "おどおど" },
	{ id: 98, name: "中部つるぎ", style: "絶望と敗北" },
] as const;

// 話者一覧（名前だけの一意なリスト）
export const SPEAKERS = Array.from(new Set(VOICES.map((voice) => voice.name)));
