#!bin/bash
if test -d /var/www/html/front;
then
    echo "folder already exists";
    cd /var/www/html/front;
    rm -rf /var/www/html/front/node_modules;
    npm cache clean --force  --silent;
else
    echo "folder doesn't exists! start setting up..";
    mkdir -p /var/www/html/;
    cd /var/www/html/;
    ng new front --routing --style=scss;
    cd front;
    npm install --save-dev @angular-devkit/build-angular;
fi


echo "--------------------- ENV SETTING --------------------------------";
sed -i "1 c\
export const hostIp='$HOST'" /var/www/html/front/src/config.ts
sed -i "2 c\
export const tokenName='$TOKEN_NAME'" /var/www/html/front/src/config.ts
# as Dev
echo "--------------------- Init --------------------------------";
npm install  --silent;
echo "--------------------- Starting --------------------------------";
exec ng serve --host 0.0.0.0;


# as production
# echo "--------------------- Initing --------------------------------";
# npm install  --silent;
# if test -d /var/www/html/front/dist;
# then
#     echo "already build - just run it !";
# else
#     echo "--------------------- Building --------------------------------";
#     ng build --configuration production   &> '/dev/null';
# fi

# echo "--------------------- Starting --------------------------------";
# exec ng serve --configuration production --host 0.0.0.0 ; #  or --skip-check-host

