#!bin/bash
rm -rf /var/www/html/back/node_modules;
npm cache clean --force;
if test -d /var/www/html/back;
then
    echo "folder already exists";
    cd /var/www/html/back;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    nest new back  --package-manager npm;
    cd /var/www/html/back;
    npm install --save @nestjs/cli;
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev;
