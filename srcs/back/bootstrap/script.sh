#!bin/bash
# apt update -y && apt upgrade -y;
# apt install -y git;
# npm i -y -g @nestjs/cli;
if test -d /var/www/html/ft_transcendence;
then
    echo "folder already exists";
    cd /var/www/html/ft_transcendence;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    nest new ft_transcendence  --package-manager npm;
    # 
    cd /var/www/html/ft_transcendence;
    npm install --save @nestjs/cli
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev
