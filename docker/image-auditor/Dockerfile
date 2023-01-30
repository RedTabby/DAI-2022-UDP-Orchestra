FROM node:18.12

COPY src /opt/app

WORKDIR /opt/app
RUN npm install

EXPOSE 2205
EXPOSE 4005

CMD ["node", "/opt/app/Auditor.js"]