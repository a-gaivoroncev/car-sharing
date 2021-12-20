## Installation

yarn

## Setup local dev environment

create .env at /env


### Create local DB

docker-compose up

### Connect to local db
* Create file /env/.env
* Add this text to file

    * POSTGRES_HOST=0.0.0.0

    * POSTGRES_PORT=5432

    * POSTGRES_USER=root

    * POSTGRES_PASSWORD=root
  
    * POSTGRES_DB=postgres

* Save

## Running the app

yarn start:dev
