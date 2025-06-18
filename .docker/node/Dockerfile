ARG IMAGE
FROM ${IMAGE}

RUN apk add --no-cache tzdata
RUN mkdir -m 755 /var/www /var/www/prisma
WORKDIR /var/www
COPY --chmod=644 ./package.json ./
COPY --chmod=644 ./package-lock.json ./
COPY --chmod=644 ./prisma/schema.prisma ./prisma
RUN npm install && npx prisma generate
