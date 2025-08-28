FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm i --no-audit --no-fund
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"]