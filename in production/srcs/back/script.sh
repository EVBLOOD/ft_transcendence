#!bin/bash
ls /var/www/html
if test -d /var/www/html/back; # run back
then
    echo "folder already exists";
    cd /var/www/html/back;
    rm -rf /var/www/html/back/node_modules;
    npm cache clean --force --silent;
    echo "ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET" > .env
    echo "HOST=$HOST" >> .env
    echo "TOKEN_NAME=$TOKEN_NAME" >> .env
    echo "FORTY_TWO_APP_UID=$FORTY_TWO_APP_UID" >> .env
    echo "FORTY_TWO_CALLBACK_URL=$FORTY_TWO_CALLBACK_URL" >> .env
    echo "FORTY_TWO_APP_SECRET=$FORTY_TWO_APP_SECRET" >> .env
else # - build for dev mode -
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    nest new back  --package-manager npm;
    cd /var/www/html/back;
fi

# as dev
# npm install;
# echo "--------------------- Starting --------------------------------";
# exec npm run start:nodemon;

# # as production
echo "--------------------- Initing --------------------------------";
npm install --silent;
if test -d /var/www/html/back/dist; 
then
    echo "Just run it, already build"
else
    echo "--------------------- Building --------------------------------";
    npm run build   --silent;
fi
echo "--------------------- Starting --------------------------------";
exec npm run start:prod;