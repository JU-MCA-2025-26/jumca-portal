FROM node:24-alpine

WORKDIR /app

# Copy root and all workspace package manifests
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY apps/client/package*.json ./apps/client/
COPY packages/shared/package*.json ./packages/shared/

RUN npm ci

COPY . .

WORKDIR /app/apps/server

RUN npm run db:generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
