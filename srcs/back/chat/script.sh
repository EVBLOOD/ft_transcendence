#!bin/bash
# apt update -y && apt upgrade -y;
# apt install -y git;
# npm i -y -g @nestjs/cli;
if test -d /var/www/html/chat;
then
    echo "folder already exists";
    cd /var/www/html/chat;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/chat;
    cd /var/www/html/chat;
    # 
    nest new .  --package-manager npm;
    # 
    npm install --save @nestjs/cli
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev