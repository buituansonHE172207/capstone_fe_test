FROM node:22-alpine3.20 AS base

ENV DOCKER_WORKDIR="/app"
ENV NODE_ENV="production"
ENV PORT="3001"

EXPOSE ${PORT}

RUN mkdir -p ${DOCKER_WORKDIR}
WORKDIR ${DOCKER_WORKDIR}


# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Build stage
FROM base AS build

COPY . .
RUN npm install --include=dev --frozen-lockfile --non-interactive
RUN npm run build

# Production stage
FROM base AS production

COPY --from=build ${DOCKER_WORKDIR}/build ./build
COPY --from=build ${DOCKER_WORKDIR}/server ./server
COPY --from=build ${DOCKER_WORKDIR}/package.json ./package.json
COPY --from=build ${DOCKER_WORKDIR}/tsconfig.json ./tsconfig.json
COPY --from=build ${DOCKER_WORKDIR}/node_modules ./node_modules

# Remove devDependencies to optimize the image for production
RUN npm prune --omit=dev

USER appuser

#CMD /bin/sh -c "npm run server:prod"
CMD ["npm", "run", "server:prod"]
