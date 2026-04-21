FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# node-pty ships prebuilds without +x on the helper binary
RUN chmod +x node_modules/node-pty/prebuilds/linux-x64/spawn-helper 2>/dev/null || true && \
    chmod +x node_modules/node-pty/prebuilds/linux-arm64/spawn-helper 2>/dev/null || true

EXPOSE 3001
CMD ["node", "dist/main"]
