# FROM node:20.11.1-alpine
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 3000

# CMD [  "npm", "run", "start:migrate:dev" ]
CMD ["/bin/sh", "-c", "JWT_SECRET=${JWT_SECRET:-$(node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")} npm run start:migrate:dev"]


