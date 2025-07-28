FROM node:lts-alpine

RUN set -ex && \
    apk add --no-cache \
    bash \
    curl \
    openssh-client \
    git

WORKDIR /app/rema-backend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
USER node

#For production
#CMD ["npm", "start"]

#For development
CMD ["npm","run","dev"]
