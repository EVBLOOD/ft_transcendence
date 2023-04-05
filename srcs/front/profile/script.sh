#!bin/bash
if test -d /var/www/html/profile;
then
    echo "folder already exists";
    cd /var/www/html/profile;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/profile;
    cd /var/www/html/profile;
    npm create vite . -- --template react-ts;
fi

npm install;
echo "--------------------- Starting --------------------------------";
exec npm run dev