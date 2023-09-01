# ft_transcendence:  Pong Contest Website

Welcome to the Pong Contest website! This project is all about bringing the classic game of Pong to a modern, multiplayer online platform. Users can play Pong with others in real-time, connect with friends, create chat rooms, and enjoy a variety of features, all built using the latest web technologies.

## Table of Contents

- [Introduction](#introduction)
- [Screen shoots](#screen)
- [Features](#features)
- [Technologies Used](#technologies-used)

## Introduction

The Pong Contest website allows users to play Pong with others in real-time. It provides a feature-rich user interface with integrated chat, authentication through the OAuth system of 42 intranet, two-factor authentication, friend management, and more. The backend is built with NestJS, the frontend with Angular, and the database is PostgreSQL (all in TypeScript).



## Screenshots

![alt text](https://github.com/EVBLOOD/ft_transcendence/tree/main/imgs/2FA.png?raw=true)
![alt text](https://github.com/EVBLOOD/ft_transcendence/tree/main/imgs/404%page.png?raw=true)
![alt text](https://github.com/EVBLOOD/ft_transcendence/tree/main/imgs/2FA.png?raw=true)
![alt text](https://github.com/EVBLOOD/ft_transcendence/tree/main/imgs/2FA.png?raw=true)
![alt text](https://github.com/EVBLOOD/ft_transcendence/tree/main/imgs/2FA.png?raw=true)



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
ACCESS_TOKEN_SECRET=
HOST=
TOKEN_NAME=
FORTY_TWO_APP_UID=
FORTY_TWO_CALLBACK_URL=
FORTY_TWO_APP_SECRET=
DATABASE_USER=
DATABASE_PASS=
DATABASE_NAME=
```
### second  : 
```
docker-compose up --build || docker compose up --build
```