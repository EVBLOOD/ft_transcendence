#!bin/bash
if ['-d /var/www/html/chat']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/chat;
    cd /var/www/html/chat;
    npm i -y -g @nestjs/cli;
    nest new .;
fi
exec bash