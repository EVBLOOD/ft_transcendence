#!bin/bash
if ['-d /var/www/html/game']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/game;
    cd /var/www/html/game;
    npm i -y -g @nestjs/cli;
    nest new .;
fi
exec bash