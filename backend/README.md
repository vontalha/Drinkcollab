# Drinkcollab Backend

To set up and make use of the backend for Drinkcollab you have two options:

1. **Local setup** (without Docker)
2. **Dockerized setup**

---

## 1. Postgres

### Option 1: Local PostgreSQL Database

Set up a PostgreSQL database locally. Follow the instructions below.

### Option 2: Use PostgreSQL with Docker

You can run PostgreSQL in a Docker container. The instructions for this are available in the [Docker Setup](#docker-setup) section.

---

## 2. Install Node modules

run:

```bash
$ npm install
```
to install the node modules required for the Drinkcollab backend

---

## 3. Setup Prisma ORM

Drinkcollab uses the Prisma ORM for CRUD operations. 

### 3.1 Connect Prisma client with Postgres DB

To connect the postgres db you set up earlier with the Prisma client, 
create a `.env` file in the root backend folder. Afterwards add the following Variable:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```
into the `.env` and replace the DB URL with your own.

The DB link ist structured as following:

- `USER` : The name of your database user
- `PASSWORD` : The password for your database user
- `HOST` : The name of your host name (for the local environment, it is localhost)
- `PORT` : The port where your database server is running (typically 5432 for PostgreSQL)
- `DATABASE` : The name of the database

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

---

## 4. Authentication

Drinkcollab uses the Nest.js JWT Module for authentication, therefore add:
```
JWT_SECRET="your_jwt_secret_key"
```

into the `.env` file and replace `your_jwt_secret_key` with a random string which is used to sign the JWTs.

You can generate a secret key using: 
```bash
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Mail

Drinkcollab uses NodeMailer to send emails. To set it up, add the following variables to the `.env` file:
```
MAIL_HOST=your_mail_host      # SMTP server hostname (e.g., smtp.mailtrap.io for testing)
MAIL_PORT=your_mail_port      # SMTP port (e.g., 465 for secure or 587 for TLS)
MAIL_USER=your_mail_user      # Your SMTP user (username or authentication key)
MAIL_PASSWORD=your_mail_password  # Your SMTP password or authentication token
MAIL_FROM=your_mail_from_address  # The email address that will appear in the "From" field
```

---

## 6. Payment

Drinkcollab integrates PayPal for processing payments. To set up PayPal in the application you will ll need to configure the following environment variables in your `.env` file:
```
PAYPAL_CLIENT_ID=your_paypal_client_id          # Your PayPal REST API client ID
PAYPAL_CLIENT_SECRET=your_paypal_client_secret  # Your PayPal REST API client secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com  # The PayPal API URL (use sandbox for testing, in case of production use https://api-m.paypal.com)
```

---

## 7. Running the backend

### Option 1: Running Locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Option 2: Running via Docker

Alternatively you can run the backend using Docker. First ensure that Docker and Docker Compose are installed.

### Docker Setup

1. **Update the `.env` file**:
```
DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@database:5432/POSTGRES_DB"
```

2. **Build and run the Docker Com**:

To start the services run the following command:
```bash
$ docker-compose up --build
```

3. **Stopping the Services**:

To stop the services run:
```bash
$ docker-compose down
```

---

## 8. Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverag
$ npm run test:cov
```

---

## 9. License

Nest is [MIT licensed](LICENSE).
