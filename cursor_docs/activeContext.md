# アクティブコンテキスト

## 現在の作業
- 開発環境のセットアップ
  - VOICEVOXのDockerコンテナ設定
  - 基本的な依存関係の設定
  - 環境変数の設定

## 最近の変更
1. プロジェクト初期化
   - deno.jsonの作成と設定
   - docker-compose.ymlの作成
   - .env.exampleの作成

2. Memory Bankの設定
   - プロジェクトドキュメントの作成
   - システム構造の定義
   - 技術スタックの明確化

## 次のステップ
1. 基本的なボット構造の実装
   - src/bot.ts：ボットの基本設定
   - src/commands/mod.ts：コマンドの基本構造
   - src/events/mod.ts：イベントハンドラの基本構造

2. ボイスチャンネル接続機能の実装
   - /joinコマンド
   - /leaveコマンド

3. VOICEVOXクライアントの実装
   - src/services/voicevox.ts：VOICEVOXのAPI呼び出し
   - src/services/audio.ts：音声処理

## 注意点
- コードの品質維持
- エラーハンドリングの徹底
- ドキュメントの更新 