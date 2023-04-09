#!bin/bash
rm -rf /var/www/html/game/node_modules;
npm cache clean --force;
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
    npm install --save-dev @angular-devkit/build-angular;
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec ng serve --open;