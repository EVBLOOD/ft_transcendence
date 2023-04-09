oldName=".git"
newName="NotGit"

find /home/sakllam/Desktop/ft_transcendence/Data/*/*/* -type d -name "$oldName" -execdir mv {} "newName" \;