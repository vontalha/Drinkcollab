# Drinkcollab Backend

To set up and make use of the backend for Drinkcollab follow these steps

## 1. Postgres

Set up a postgres database locally

## 2. Install Node modules

run

```bash
$ npm install
```
to install the node modules required for the Drinkcollab backend

## 3. Setup Prisma ORM

Drinkcollab uses the Prisma ORM for CRUD operations. 

### 3.1 Connect Prisma client with Postgres DB

To connect the postgres db you set up earlier with the Prisma client, 
create a `.env` file in the root backend folder. Afterwards add the following Variable:

`DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

into the `.env` and replace the DB URL with your own.

The DB link ist structured as following:

- `USER` : The name of your database user
- `HOST` : The name of your host name (for the local environment, it is localhost)
- `PORT` : The port where your database server is running (typically 5432 for PostgreSQL)
- `DATABASE` : The name of the database
- `SCHEMA` : The name of the schema inside the database

## 3.2 Generate Prisma client

To generate the required Prisma client run:
```bash
$ npx prisma generate
```

### 3.3 Migrating the schema

To map the data model defined in `prisma/schema.prisma` to the postgres db schema,  
you need to use the `prisma migrate` CLI commands:

```bash
$ npx prisma migrate dev --name init
```

### 3.3 Prisma Studio

You can run 
```bash
$ npx prisma studio
```
to view and edit the db.

## Authentication

Drinkcollab uses the Nest.js JWT Module for authentication, therefore add:

`JWT_SECRET="your_jwt_secret_key"`

into the `.env` file and replace `your_jwt_secret_key` with a random string which is used to sign the JWTs.
You can generate a secret key using: 
```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running the backend

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
