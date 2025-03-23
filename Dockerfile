FROM node:20-slim AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptのビルド（viteビルド）
RUN npm run build

# 実行用のイメージ
FROM node:20-slim

WORKDIR /app

# 依存関係のインストール（開発依存関係は除外）
COPY package*.json ./
RUN npm ci --only=production

# ビルド済みのファイルをコピー
COPY --from=builder /app/dist ./dist

CMD ["npm", "start"]
