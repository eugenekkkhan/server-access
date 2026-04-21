FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chmod +x node_modules/node-pty/prebuilds/linux-x64/spawn-helper 2>/dev/null || true && \
    chmod +x node_modules/node-pty/prebuilds/linux-arm64/spawn-helper 2>/dev/null || true

EXPOSE 3001
CMD ["node", "dist/main"]
