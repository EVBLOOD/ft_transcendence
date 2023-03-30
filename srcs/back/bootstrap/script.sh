#!bin/bash
if ['-d /var/www/html/ft_tarnscendence']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    npm i -y -g @nestjs/cli;
    nest new ft_tarnscendence;
fi
exec bash