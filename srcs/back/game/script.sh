#!bin/bash
if test -d  /var/www/html/game;
then
    echo "folder already exists";
    cd /var/www/html/game;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html/game;
    cd /var/www/html/game;
    npm i -y -g @nestjs/cli;
    nest new .  --package-manager npm;
fi
exec npm run start:dev