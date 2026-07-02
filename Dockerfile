# --- build (Nitro produces a self-contained .output) ---
FROM node:24.1.0-bookworm AS build
RUN npm install -g npm@11.5.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- run the production Nitro server (no dev-server host checks) ---
FROM node:24.1.0-bookworm
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV HOST=0.0.0.0 PORT=3000 NITRO_HOST=0.0.0.0 NITRO_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
