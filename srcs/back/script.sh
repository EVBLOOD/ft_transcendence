#!bin/bash
if test -d /var/www/html/back; # run back
then
    echo "folder already exists";
    cd /var/www/html/back;
    rm -rf /var/www/html/back/node_modules;
    npm cache clean --force;
else # - build for dev mode -
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    nest new back  --package-manager npm;
    cd /var/www/html/back;
fi

# as dev
npm install;
# echo "--------------------- Starting --------------------------------";
exec npm run start:nodemon;

# as production
echo "--------------------- Initing --------------------------------";
npm install;
echo "--------------------- Building --------------------------------";
npm run build;
echo "--------------------- Starting --------------------------------";
exec npm run start:prod;