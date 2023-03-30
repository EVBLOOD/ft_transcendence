#!bin/bash
if ['-d /var/www/html/ft_tarnscendence']
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    npm i -y -g create-single-spa@4.1.3;
    # npx create-single-spa --moduleType root-config
    # npm create vite ft_tarnscendence --template react-ts;
fi
exec bash