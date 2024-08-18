# FROM node:20.11.1-alpine
FROM node:latest AS builder


WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

EXPOSE 3000

CMD [  "npm", "run", "start:migrate:prod" ]
