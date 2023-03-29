# evm-runners-backend

This is the branch for fly.io deployment.
Note that this requires a foundry project like `evm-runners-levels` to run the tests in the deployment environment.

## Deployment 

1. [Follow this](https://fly.io/docs/languages-and-frameworks/node/) to create an app. When asked if fly should create a postgres database, select yes so it connects the two apps.
    - If the app is already created any modification will get picked up and deployed, so skip this step.

2. We should have two apps: the `evm-runners` nodejs app, and the `evm-runners-db` postgresql app. We need to configure the database.
    - Run `fly proxy 5432 -a evm-runners-db` so fly creates a proxy for us to connect to the database using localhost. Connect to `localhost:5432` and import the `evm_runners_postgres_schema.sql`.

3. Update `evm-runners` environment variables so it successfully connects to `evm-runners-db`.
    - First we can run `fly ssh console & echo $DATABASE_URL` to get the information. It will return a connection string with this format:

    ```
    postgres://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}?sslmode=disable
    ```

    - `fly.toml` is the place for environment variables, but since these contain sensitive information fly allows us to set secrets using `fly secrets set PGUSER=USER`, for example.
    The following variables are needed: 
        - `PGUSER=USER`
        - `PGPASSWORD=PASSWORD`
        - `PGHOST=HOST`
        - `PGDATABASE=DATABASE`
        - `PGPORT=PORT`
   
## Endpoints

The endpoints are the same as the main branch. The difference is in the host, which is now the `evm-runners` app. Something like `curl https://evm-runners.fly.dev/users/` should return the users.