FROM node:20-slim AS builder

WORKDIR /app

# ビルド依存関係をインストール
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    libtool \
    autoconf \
    automake \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

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

# 実行時の依存関係をインストール
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 依存関係のインストール（開発依存関係は除外）
COPY package*.json ./
RUN npm ci --only=production

# ビルド済みのファイルをコピー
COPY --from=builder /app/dist ./dist

CMD ["npm", "start"]
