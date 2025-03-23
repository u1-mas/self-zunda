# VOICEVOXのOpenAPI仕様からTypeScript型定義の生成

**ステータス**: 🔄 進行中
**ブランチ**: cursor/voicevox-types
**開始日**: 2023-03-23
**完了日**: -

## 概要
VOICEVOXのOpenAPI仕様をcurlで取得し、それを元にTypeScript型定義を自動生成します。生成した型定義をプロジェクト内で活用することで、型安全性を高め、開発効率を向上させます。

## タスク
- [x] OpenAPI仕様をcurlで取得
- [x] openapi-typescriptツールをインストール
- [x] TypeScript型定義ファイルの生成
- [x] 既存のインターフェイス定義を生成した型定義に置き換え
- [ ] 型定義を活用した実装の改善
- [ ] テストの更新

## 進捗メモ
- 2023-03-23: OpenAPI仕様を取得し、openapi-typescriptツールを使用して型定義を生成しました。
- 2023-03-23: src/utils/voicevox.tsの独自インターフェース定義を生成された型定義に置き換えました。
- 2023-03-23: textToSpeech.tsを更新し、ユーザーIDとサーバーIDを音声生成に渡すようにしました。 