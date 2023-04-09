#!bin/bash
rm -rf /var/www/html/game/node_modules;
npm cache clean --force;
if test -d /var/www/html/game;
then
    echo "folder already exists";
    cd /var/www/html/game;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/game;
    cd /var/www/html/game;
    nest new .  --package-manager npm;
    npm install --save @nestjs/cli;
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev;