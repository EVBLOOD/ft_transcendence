#!bin/bash
if test -d /var/www/html/auth;
then
    echo "folder already exists";
    cd /var/www/html/auth;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/auth;
    cd /var/www/html/auth;
    npm i -y -g @nestjs/cli;
    nest new . --package-manager npm;
fi
exec npm run start:dev