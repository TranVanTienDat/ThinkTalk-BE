
FROM node:20-alpine  as dev
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
ENTRYPOINT ["yarn"]
CMD ["start:dev"]
EXPOSE 3000

# Build production dist
FROM node:20-alpine as builder
WORKDIR /app
ENV NODE_ENV production
COPY --from=dev /app/node_modules ./node_modules
COPY . . 
RUN yarn build
RUN rm -rf node_modules
RUN yarn --frozen-lockfile --production

# Run production version only with necessary files
FROM node:20-alpine as production
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nest
RUN adduser --system --uid 1001 nest
COPY --from=builder --chown=nest:nest /app/dist ./dist
COPY --from=builder --chown=nest:nest /app/node_modules ./node_modules
COPY --from=builder --chown=nest:nest /app/package.json ./package.json
USER nest
CMD ["yarn", "start:prod"]