# Drinkcollab Backend

To set up and make use of the backend for Drinkcollab follow these steps

## 1. Postgres
Change current directory to backend
```bash
$ cd backend
```
Set up a Docker container with postgres database

```bash
$ docker compose up -d
```

## 2. Install Node modules

run:

```bash
$ npm install
```
to install the node modules required for the Drinkcollab backend

## 3. Setup Prisma ORM

Drinkcollab uses the Prisma ORM for CRUD operations.

### 3.1 Connect Prisma client with Postgres DB

To connect the postgres db you set up earlier with the Prisma client,
create a `.env` file in the root backend folder. Afterwards add the following Variable:
```
DATABASE_URL=postgresql://postgres:example@localhost:5432/postgres
```

and 
```
JWT_SECRET="your_jwt_secret_key"
```

Replace `your_jwt_secret_key` with a random String which is used to sign the JWTs.

You can generate a secret key using:
```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```


### 3.2 Generate Prisma client

To generate the required Prisma client run:
```bash
$ npx prisma generate
```

### 3.3 Migrating the schema

To map the data model defined in `prisma/schema.prisma` to the postgres db schema, you need to use the `prisma migrate` CLI commands:

```bash
$ npx prisma migrate dev --name init
```

### 3.3 Prisma Studio

You can run:
```bash
$ npx prisma studio
```
to view and edit the db.

## 5. Running the backend

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

# test coverag
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
