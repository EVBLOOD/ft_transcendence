#!bin/bash
if test -d /var/www/html/profile;
then
    echo "folder already exists";
    cd /var/www/html/profile;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html profile;
    cd /var/www/html profile;
    npm i -y -g @nestjs/cli;
    nest new .  --package-manager npm;
fi
exec npm run start:dev