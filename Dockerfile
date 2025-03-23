FROM node:20-slim AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# 相対パスのインポートのみ拡張子を追加（外部パッケージには追加しない）
RUN find dist -name "*.js" -exec sed -i 's/from "\.\.\//from "\.\.\//g; s/from "\.\//from "\.\//g; s/from "\.\.\/\([^"]*\)"/from "\.\.\/\1.js"/g; s/from "\.\/\([^"]*\)"/from "\.\/\1.js"/g' {} \;

# 実行用のイメージ
FROM node:20-slim

WORKDIR /app

# 依存関係のインストール（開発依存関係は除外）
COPY package*.json ./
RUN npm ci --only=production

# package.jsonにtype: moduleを追加
RUN sed -i '/"main": / a \ \ "type": "module",' package.json

# ビルド済みのファイルをコピー
COPY --from=builder /app/dist ./dist

CMD ["npm", "start"]
