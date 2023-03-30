#!bin/bash
if ['-d /var/www/html/bootstarap']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/bootstarap;
    cd /var/www/html/bootstarap;
    npm i -y -g @angular/cli
    ng new .;
    # nest new ft_tarnscendence;
fi
exec bash