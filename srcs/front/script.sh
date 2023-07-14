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

echo "--------------------- Init --------------------------------";
npm install;
# npm audit fix --legacy-peer-deps;
# npm audit fix --legacy-peer-deps;
# npm install;
echo "--------------------- Starting --------------------------------";
exec ng serve;