FROM node:16.17.0-bullseye-slim

RUN apt update -y && apt upgrade -y && apt install -y git;
RUN npm install -g npm@latest &&  npm i -g @angular/cli &&  npm i -g create-vite@4.2.0 && \
    npm i -g create-single-spa &&  npm i -g sb@latest &&  npm i -g @nestjs/cli && \
    npm install -g @angular-devkit/build-angular;
CMD [ "bash" ]