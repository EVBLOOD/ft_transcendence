#!bin/bash
rm -rf /var/www/html/auth/node_modules;
npm cache clean --force;
if test -d /var/www/html/auth;
then
    echo "folder already exists";
    cd /var/www/html/auth;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/;
    cd /var/www/html/;
    ng new auth --routing --style=scss;
    cd auth;
    npm install --save-dev @angular-devkit/build-angular;
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec ng serve --open;