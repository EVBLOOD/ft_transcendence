#!bin/bash
if test -d /var/www/html/ft_transcendence;
then
    echo "folder already exists";
    cd /var/www/html/ft_transcendence;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html;
    cd /var/www/html;
    npm i -y -g @nestjs/cli;
    nest new ft_transcendence  --package-manager npm;
fi
exec npm run start:dev
