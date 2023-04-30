#!bin/bash
rm -rf /var/www/html/back/node_modules;
npm cache clean --force;
if test -d /var/www/html/back;
then
    echo "folder already exists";
    cd /var/www/html/back;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html;
    cd /var/www/html;
    nest new back  --package-manager npm;
    cd /var/www/html/back;
    npm install --save @nestjs/cli @nestjs/typeorm typeorm pg @nestjs/mapped-types;
    npm install --save-dev nodemon;
    npm install --save @nestjs/passport passport passport-42;
    npm install --save dotenv;
    npm install --save-dev nodemon;
    # npm i -D @types/passport-42;
    # nest g resource user; -> generate stuff
fi

echo "--------------------- Init --------------------------------";
npm install;
echo "--------------------- Starting --------------------------------";
exec npm run start:dev;
# nest start --watch;
