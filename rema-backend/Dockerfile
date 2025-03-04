FROM node:lts-alpine

WORKDIR /app/rema-backend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
USER node
CMD ["npm", "start"]
