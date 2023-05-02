FROM node:alpine

WORKDIR /app

EXPOSE 3000

COPY package*.json .

RUN npm install
RUN npm build

COPY . .

CMD ["npm", "run", "start"]
