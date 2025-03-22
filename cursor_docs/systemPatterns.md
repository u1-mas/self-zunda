# システムパターン

## アーキテクチャ
- モジュラー設計
  - 機能ごとにモジュールを分割
  - 疎結合な構造で拡張性を確保
  - 依存関係の明確化

## ディレクトリ構造
```
/
├── .env.example    # 環境変数の例
├── .gitignore     # Gitの除外設定
├── deno.json      # Denoの設定
├── deps.ts        # 依存関係の管理
├── main.ts        # メインエントリーポイント
├── docker-compose.yml    # VOICEVOXコンテナの設定
├── src/
│   ├── bot.ts     # ボットの設定と機能
│   ├── commands/  # コマンドの実装
│   │   ├── mod.ts
│   │   ├── join.ts
│   │   ├── leave.ts
│   │   └── voice.ts
│   ├── events/    # イベントハンドラ
│   │   ├── mod.ts
│   │   ├── messageCreate.ts
│   │   └── voiceStateUpdate.ts
│   ├── services/  # 外部サービス連携
│   │   ├── voicevox.ts   # VOICEVOX API
│   │   └── audio.ts      # 音声処理
│   ├── types/    # 型定義
│   │   └── index.ts
│   └── utils/    # ユーティリティ
│       ├── config.ts     # 設定管理
│       └── storage.ts    # データ永続化
└── README.md
```

## 技術的な決定事項
1. VOICEVOXの利用
   - Dockerコンテナで実行
   - HTTP APIで通信
   - 音声合成の品質と柔軟性を重視

2. Discordeno
   - 最新のDiscord API対応
   - TypeScriptネイティブ
   - パフォーマンスと安定性

3. データ永続化
   - ファイルベースの設定保存
   - JSONフォーマットでの管理
   - サーバーごとの設定分離

## 開発パターン
1. コマンド実装
   - スラッシュコマンドの使用
   - コマンドごとのモジュール化
   - ヘルプ情報の統合

2. イベント処理
   - イベントハンドラの分離
   - エラーハンドリングの統一
   - 非同期処理の適切な管理

3. エラー処理
   - 詳細なエラーログ
   - ユーザーフレンドリーなエラーメッセージ
   - 自動リカバリー機能

4. テスト
   - ユニットテスト
   - 統合テスト
   - モック/スタブの活用 