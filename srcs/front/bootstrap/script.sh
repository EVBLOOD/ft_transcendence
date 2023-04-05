#!bin/bash
# apt update -y && apt upgrade -y;
# apt install -y git;
# npm i -y -g create-single-spa;
# npm i -y -g sb@latest;
if test -d /var/www/html/ft_transcendence;
then
    echo "folder already exists";
    cd /var/www/html/ft_transcendence;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    npx create-single-spa ft_transcendence --moduleType util-module --framework react --package-manager npm  --typescript --orgName my-org --projectName ft_transcendence;
    cd ft_transcendence;
    npm install;
    npx sb@latest add angular;
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec npm start

# CMD [ "tail", "-f", "/script.sh" ]