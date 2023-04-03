FROM node:16.17.0-bullseye-slim

RUN apt update -y && apt upgrade -y && apt install -y git;
RUN npm install -g npm@latest; npm i -y -g @angular/cli; npm i -y -g create-vite@4.2.0;\
    npm i -y -g create-single-spa; npm i -y -g sb@latest; npm i -y -g @nestjs/cli;
CMD [ "bash" ]