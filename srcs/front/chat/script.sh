#!bin/bash
if test -d /var/www/html/chat;
then
    echo "folder already exists";
    cd /var/www/html/chat;
else
    echo "folder doesn't exists! start setting up..";
    apt update -y && apt upgrade -y;
    apt install -y git;
    mkdir -p /var/www/html/chat;
    cd /var/www/html/chat;
    npm i -y -g create-vite@4.2.0;
    npm create vite . -- --template react-ts;
    npm install;
fi
exec npm run dev