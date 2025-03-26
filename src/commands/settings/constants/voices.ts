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
	{ id: 39, name: "ずんだもん", style: "ヘロヘロ" },
	{ id: 50, name: "ずんだもん", style: "なみだめ" },

	// その他の話者
	{ id: 8, name: "春日部つむぎ", style: "ノーマル" },
	{ id: 9, name: "雨晴はう", style: "ノーマル" },
	{ id: 10, name: "波音リツ", style: "ノーマル" },
	{ id: 11, name: "波音リツ", style: "クイーン" },
];

// 話者一覧（名前だけの一意なリスト）
// Discord制限（25選択肢）に合わせて、一部の主要キャラクターのみを表示
export const SPEAKERS = [
	{ name: "ずんだもん" },
	{ name: "四国めたん" },
	{ name: "春日部つむぎ" },
	{ name: "雨晴はう" },
	{ name: "波音リツ" },
];
