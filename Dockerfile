FROM node:20-slim

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

CMD ["npm", "start"] 