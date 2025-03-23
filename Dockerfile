FROM node:20-slim AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# ビルドされたJSファイルのimportパスに拡張子を追加
RUN find dist -name "*.js" -exec sed -i 's/from "\(\.\.\/\)*\([^"]*\)"/from "\1\2.js"/g' {} \;
RUN find dist -name "*.js" -exec sed -i 's/from "\.\//from ".\//' {} \;

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
