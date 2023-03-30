#!bin/bash
# if ['-d /var/www/html/auth']
if test -d /var/www/html/auth;
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/auth;
    cd /var/www/html/auth;
    npm i -y -g @nestjs/cli;
    # nest new .;
fi
