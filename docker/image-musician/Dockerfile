FROM node:18.12

COPY src /opt/app

WORKDIR /opt/app
RUN npm install json

ENTRYPOINT ["node", "/opt/app/Musician.js"]