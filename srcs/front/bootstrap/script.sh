#!bin/bash
if test -d /var/www/html/ft_tarnscendence;
then
    echo "folder already exists";
    cd /var/www/html/ft_tarnscendence;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html;
    cd /var/www/html;
    npm i -y -g create-single-spa;
    npx create-single-spa ft_tarnscendence --moduleType util-module --framework react --package-manager npm  --typescript --orgName my-org --projectName ft_tarnscendence;
    cd ft_tarnscendence;
    npm install;
    npm i -y -g sb@latest;
    npx sb@latest add angular;
fi
exec npm start

# CMD [ "tail", "-f", "/script.sh" ]