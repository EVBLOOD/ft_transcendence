#!bin/bash
if ['-d /var/www/html profile']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html profile;
    cd /var/www/html profile;
    npm i -y -g @nestjs/cli;
    nest new .;
fi
exec bash