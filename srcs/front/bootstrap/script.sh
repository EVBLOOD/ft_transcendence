#!bin/bash
if test -d /var/www/html/ft_tarnscendence;
then
    echo "folder already exists";
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    npm i -y -g create-single-spa@4.1.3;
    npx create-single-spa ft_tarnscendence -- -- --framework react --template root-config
    cd ft_tarnscendence
    npm install
    npx sb@latest add angular
fi
exec bash

# CMD [ "tail", "-f", "/script.sh" ]