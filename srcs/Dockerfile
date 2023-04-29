FROM node:18-bullseye-slim

RUN apt update -y && apt upgrade -y && apt install -y git;
RUN npm install -g npm@latest &&  npm i -g @angular/cli &&  \
    npm i -g @nestjs/cli && npm install -g @angular-devkit/build-angular;
   
CMD [ "bash" ]