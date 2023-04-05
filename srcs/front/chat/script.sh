#!bin/bash
# apt update -y && apt upgrade -y;
# apt install -y git;
# npm i -y -g create-vite@4.2.0;
if test -d /var/www/html/chat;
then
    echo "folder already exists";
    cd /var/www/html/chat;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/chat;
    cd /var/www/html/chat;
    npm create vite . -- --template react-ts;
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec npm run dev