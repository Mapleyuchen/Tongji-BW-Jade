FROM node:20-bookworm-slim AS client-builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev
COPY server ./server
COPY --from=client-builder /app/client/dist ./client/dist
EXPOSE 8080
CMD ["node", "server/src/server.js"]
