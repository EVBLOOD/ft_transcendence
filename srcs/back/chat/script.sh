#!bin/bash
#npm cache clean --force;
if test -d /var/www/html/chat;
then
    echo "folder already exists";
    cd /var/www/html/chat;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/chat;
    cd /var/www/html/chat;
    nest new .  --package-manager npm;
    npm install --save @nestjs/cli;
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev;