FROM denoland/deno:1.40.2

WORKDIR /app

# キャッシュレイヤーを活用するために依存関係を先にコピー
COPY deps.ts .
RUN deno cache deps.ts

# ソースコードをコピー
COPY . .

# 必要な権限を付与
RUN deno cache src/index.ts

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"] 