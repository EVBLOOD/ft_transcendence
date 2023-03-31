#!bin/bash
if test -d /var/www/html/profile;
then
    echo "folder already exists";
    cd /var/www/html/profile;
    npm install;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/profile;
    cd /var/www/html/profile;
    npm i -y -g create-vite@4.2.0;
    npm create vite . -- --template react-ts;
    npm install;
fi
exec npm run dev