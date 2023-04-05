#!bin/bash
# apt install -y git;
# apt update -y && apt upgrade -y;
# npm install -g npm@latest;
# npm i -y -g @angular/cli;
if test -d /var/www/html/game;
then
    echo "folder already exists";
    cd /var/www/html/game;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/;
    cd /var/www/html/;
    ng new game --routing --style=scss;
    cd game;
    npm install --save-dev @angular-devkit/build-angular
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec ng serve --open