#!bin/bash
rm -rf /var/www/html/front/node_modules;
npm cache clean --force;
if test -d /var/www/html/front;
then
    echo "folder already exists";
    cd /var/www/html/front;
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
echo "--------------------- Starting --------------------------------";
exec ng serve --open;