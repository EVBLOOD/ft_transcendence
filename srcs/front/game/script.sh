#!bin/bash
if test -d /var/www/html/game;
then
    echo "folder already exists";
    cd /var/www/html/game;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html/;
    cd /var/www/html/;
    npm i -y -g @angular/cli;
    ng new game --routing --style=scss;
    cd game;
fi
exec ng serve