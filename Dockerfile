FROM node:18-alpine-3.16 AS deps

WORKDIR /home/node

COPY package*.json .

RUN npm ci

FROM node:18-alpine-3.16 AS builder

WORKDIR /home/node

COPY --from=deps /home/node/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION true

RUN npm run build

FROM node:18-alpine-3.16 AS runtime

WORKDIR /home/node

RUN addgroup -S -g 10001 appGrp \
    && adduser -S -D -u 10000 -s /sbin/nologin -h /home/node -G appGrp app \
    && chown -R 10000:10001 /home/node

COPY --from=builder --chown=10000:10001 /home/node/.next/standalone ./
COPY --from=builder --chown=10000:10001 /home/node/.next/static ./.next/static

USER 10000:10001

ENV PORT 8080

EXPOSE 8080

CMD ["npm", "run", "start"]