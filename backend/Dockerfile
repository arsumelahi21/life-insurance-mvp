FROM node:18

# Install netcat (for wait-for-it.sh)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

ENV NODE_ENV=production
EXPOSE 4000

CMD ["./wait-for-it.sh", "db:5432", "--", "node", "dist/index.js"]
