# Authentication and Authorization Backend Project

Powered by [NestJs](https://nestjs.com/)\
For the database, Postgres is used.

## run the App

1- Install the postgres database\
2- Change the variables in the config folder\
3- Simply run the bellow scripts

### `npm i`

### `npm run start`

or

### `npm run start:dev`

Note: you should set the below parameters in the config folder with our own config or pass them as [environmental variables].

## server:

port: 4000 [PORT]

## db:

type: 'postgres'\
port: 5432 [DB_PORT]\
database: 'auth' [DB_DATABASE]\
host: 'localhost' [DB_HOSTNAME]\
username: 'postgres' [DB_USERNAME]\
password: 'postgres' [DB_PASSWORD]\
synchronize: true [TYPEORM_SYNC]\

## jwt:

secret: 'secret' [JWT_SECRET]\
expiresIn: 3600

## SMTP Server:

host: 'mail.mcee.ir' [SMTP_HOSTNAME]\
port: 25, [SMTP_PORT]\
user: '\_\_\_' [SMTP_USERNAME]\
pass: '\_\_\_' [SMTP_PASSWORD]
