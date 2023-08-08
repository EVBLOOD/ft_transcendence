#!bin/bash
if test -d /var/www/html/front;
then
    echo "folder already exists";
    cd /var/www/html/front;
    rm -rf /var/www/html/front/node_modules;
    npm cache clean --force;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/;
    cd /var/www/html/;
    ng new front --routing --style=scss;
    cd front;
    npm install --save-dev @angular-devkit/build-angular;
fi

# as Dev
# echo "--------------------- Init --------------------------------";
# npm install;
# echo "--------------------- Starting --------------------------------";
# exec ng serve --host 0.0.0.0;


# as production
echo "--------------------- Initing --------------------------------";
npm install;
echo "--------------------- Building --------------------------------";
ng build --configuration production
echo "--------------------- Starting --------------------------------";
exec ng serve --configuration production --host 0.0.0.0; #  or --skip-check-host