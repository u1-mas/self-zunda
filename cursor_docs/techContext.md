# 技術コンテキスト

## 使用技術
1. 実行環境
   - Deno v1.41.0以上
   - TypeScript
   - WSL2 (Ubuntu 22.04)
   - fish shell

2. フレームワーク/ライブラリ
   - Discordeno v21.0.0
     - Discord APIクライアント
     - TypeScriptネイティブ
   - VOICEVOX
     - 音声合成エンジン
     - Dockerコンテナで実行

3. 開発ツール
   - Visual Studio Code
   - Docker
   - Git

## 開発環境セットアップ
1. 前提条件
   - Deno
   - Docker
   - Git

2. 環境変数
   ```
   # Discord Bot Token
   DISCORD_TOKEN=your_token_here

   # VOICEVOX設定
   VOICEVOX_API_URL=http://localhost:50021
   DEFAULT_SPEAKER=1  # ずんだもん（あまあま）
   ```

3. VOICEVOXセットアップ
   ```bash
   # Dockerコンテナの起動
   docker-compose up -d
   ```

4. 開発サーバー起動
   ```bash
   # 依存関係の更新
   deno cache --reload deps.ts

   # 開発サーバー起動
   deno task dev
   ```

## 技術的制約
1. パフォーマンス
   - メッセージ処理の遅延を最小限に
   - 音声合成の処理時間の最適化
   - メモリ使用量の管理

2. スケーラビリティ
   - 複数サーバーでの同時使用
   - 並行処理の適切な管理
   - リソース使用量の制御

3. セキュリティ
   - トークンの安全な管理
   - APIアクセスの制限
   - エラー情報の適切な処理

4. 保守性
   - モジュラー設計
   - コードの可読性
   - ドキュメントの維持 