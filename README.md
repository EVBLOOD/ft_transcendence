# ft_transcendence

host in back end is now easy to change - a var in service code and an other in .env
## reminder
before lanching the project you should first create the `base` folder for database.
after that there is a `.env` file that should be created in back-end folder root where you have your 42API infos listed as :
```
FORTY_TWO_APP_UID="UID"
FORTY_TWO_APP_SECRET="SECRET"
FORTY_TWO_CALLBACK_URL="http://localhost:3001/auth/callback"
```
there is no need to use command for the now `find . -type d -empty -not -path "./.git/*" -exec touch {}/.gitkeep \;`
we will use RxJS Library with angular => { docs } : https://angular.io/guide/rx-library

DEV HINT:
By default, if any error happens while creating the application your app will exit with the code 1. If you want to make it throw an error instead disable the option abortOnError (e.g., NestFactory.create(AppModule, { abortOnError: false })).