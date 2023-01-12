# HERCULE

>plateforme de recherche des usage de ressources et outils numériques dans les pratiques d'enseignement et les apprentissages.

![Screenshot](./screenshot.jpg)

## Requirements

* nodejs v18.12.1
* npm v9.2.0
* postgresql v12

## Installation

Download the repository from github then install all npm packages.

```sh
git clone https://github.com/tr-tt/moutarde.git ~/Programs/moutarde
cd ~/Programs/moutarde
npm i
```

#### Mode : development

Create a new file called **~/Programs/moutarde/.env.development**

```sh
vim .env.development
```

Edit the file with the following content and replace all words between [brackets]

```
NODE_ENV=development

# app variables

APP_PORT=8000
APP_SECRET=[SECRET_STRING_FOR_JWT]
LOG_LEVEL=debug

# postgres variables

POSTGRES_DATABASE=[THE_POSTGRES_DATABASE_NAME]
POSTGRES_USER=[THE_POSTGRES_USER]
POSTGRES_PASSWORD=[THE_POSTGRES_USER_S_PASSWORD]
POSTGRES_HOST=[THE_POSTGRES_HOST, default=localhost]
POSTGRES_PORT=[THE_POSTGRES_PORT, default=5432]
POSTGRES_DIALECT=postgres

# email variables

EMAIL_HOST=[THE_SMTP_SERVER_HOST]
EMAIL_PORT=[THE_SMTP_SERVER_PORT, default=465]
EMAIL_USER=[THE_SMTP_SERVER_USER_EMAIL]
EMAIL_PASSWORD=[THE_SMTP_SERVER_USER_PASSWORD]
```

Build the application in development mode.

```sh
npm run build:dev
npm run start:dev
```

When the building process is complete, the application is available here [http://localhost:8000](http://localhost:8000/) by default.

#### Mode : production

Create a new file called **~/Programs/moutarde/.env.production**

```sh
vim .env.production
```

Edit the file with the following content and replace all words between [brackets]

```
NODE_ENV=production

# app variables

APP_PORT=9000
APP_SECRET=[SECRET_STRING_FOR_JWT]
LOG_LEVEL=info

# postgres variables

POSTGRES_DATABASE=[THE_POSTGRES_DATABASE_NAME]
POSTGRES_USER=[THE_POSTGRES_USER]
POSTGRES_PASSWORD=[THE_POSTGRES_USER_S_PASSWORD]
POSTGRES_HOST=[THE_POSTGRES_HOST, default=localhost]
POSTGRES_PORT=[THE_POSTGRES_PORT, default=5432]
POSTGRES_DIALECT=postgres

# email variables

EMAIL_HOST=[THE_SMTP_SERVER_HOST]
EMAIL_PORT=[THE_SMTP_SERVER_PORT, default=465]
EMAIL_USER=[THE_SMTP_SERVER_USER_EMAIL]
EMAIL_PASSWORD=[THE_SMTP_SERVER_USER_PASSWORD]
```

Build the application in production mode.

```sh
npm run build:prod
npm run start:prod
```

When the building process is complete, the application is available here [http://localhost:9000](http://localhost:9000/) by default.

## Update

Upload new code from github and clean old files

```sh
cd ~/Programs/moutarde
git pull
rm -rf _build
```

#### Mode : development

Rebuild the application

```sh
npm run build:dev
npm run start:dev
```

#### Mode : production

Rebuild the application

```sh
npm run build:prod
npm run start:prod
```


## Log files

Log files are created at the application startup and stored in **~/Programs/moutarde/_logs**