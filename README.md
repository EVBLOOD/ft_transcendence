# ft_transcendence

## reminder
before lanching the project you should first create the `base` folder for database.
after that there is a `.env` file that should be created in back-end folder root where you have your 42API infos listed as :
```
FORTY_TWO_APP_UID="UID"
FORTY_TWO_APP_SECRET="SECRET"
FORTY_TWO_CALLBACK_URL="http://localhost:3001/auth/callback"
```
there is no need to use command for the now `find . -type d -empty -not -path "./.git/*" -exec touch {}/.gitkeep \;`