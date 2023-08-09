FROM node:18-bullseye-slim

RUN apt update -y && apt upgrade -y && apt install -y git;\
    npm install -g npm@latest && npm i -g @nestjs/cli;

COPY script.sh .

CMD ["sh", "/script.sh"]