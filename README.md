# ft_transcendence:  Pong Contest Website

Welcome to the Pong Contest website! This project is all about bringing the classic game of Pong to a modern, multiplayer online platform. Users can play Pong with others in real-time, connect with friends, create chat rooms, and enjoy a variety of features, all built using the latest web technologies.

## Table of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)

## Introduction

The Pong Contest website allows users to play Pong with others in real-time. It provides a feature-rich user interface with integrated chat, authentication through the OAuth system of 42 intranet, two-factor authentication, friend management, and more. The backend is built with NestJS, the frontend with Angular, and the database is PostgreSQL (all in TypeScript).



## Screenshots
```
Login page
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/load%20page.png)

```
Current user profile
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Profile%20(3).png)

```
Current user profile (friendships side)
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Profile%20(2).png)

```
User's Settings Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Settings.png)

```
Activate the 2FA
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/2FA.png)

```
Another user profile
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Profile.png)

```
Another user profile (this case a user that sent a friend request)
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Profile%20(1).png)

```
404 page (case user blocked or doesn't exist!)
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/404%20page.png)

```
Chat : DM Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Chat%20-%20DM.png)

```
Create Channels
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Chat%20-%20Channels%20(2).png)

```
Join Channels
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Chat%20-%20Channels%20(1).png)

```
Chat: Channels Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Chat%20-%20Channels.png)

```
Invite To Channel Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Invite%20-%20Channels.png)

```
Join Games Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/box%20list%20profile.png)

```
Game play Interface
```
![alt text](https://github.com/EVBLOOD/ft_transcendence/blob/main/screenshots/Game.png)

## Features

Here are some of the key features of the Pong Contest website:

- Real-time multiplayer Pong games.
- User-friendly interface.
- Integrated chat system.
- OAuth login via the 42 intranet.
- Two-factor authentication for added security.
- Friend management to connect with other users.
- Creation of public, private, or password-protected chat rooms (channels).
- Direct messaging between users.
- Matchmaking system for automatic game pairing.

## Technologies Used

The Pong Contest website is built using the following technologies:

- **Backend**: NestJS
- **Frontend**: Angular
- **Database**: PostgreSQL
- **Authentication**: OAuth system of 42 intranet
- **Two-Factor Authentication**: Tested with google authenticator and authy
- **Real-time Communication**: WebSockets

## Getting Started

To run the Pong Contest website locally, follow these steps:

### first : to run the project you'll need to add a .env File with this values : 
```
ACCESS_TOKEN_SECRET='as the key says'
HOST='http://{localhost Or your ip}'
TOKEN_NAME='as the key says'
FORTY_TWO_APP_UID='as the key says'
FORTY_TWO_CALLBACK_URL='as the key says'
FORTY_TWO_APP_SECRET='as the key says'
POSTGRES_USER='just use the POSTGRES default user'
POSTGRES_PASSWORD='as the key says'
POSTGRES_DB='as the key says'
```
### second  : 
```
docker-compose up --build || docker compose up --build
```

### third  : 

```
launch browser: http://{your ip}:4200
&&
Enjoy your ride with up
```