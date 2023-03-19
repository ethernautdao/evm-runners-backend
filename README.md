# evm-runners-backend

## Requirements

- Node.js v16.16.0
- NPM v8.11.0
- postgresql

## Setting up the environment

The server is expecting to connect to a postgresql database. 
[Follow the docs](https://www.postgresql.org/docs/) and set up a postgres server on your system.
After the server is up and running, create a database named `evm_runners`.
Then, you can import the schema in the file `evm_runners_database_schema.sql`.
As an example, in Ubuntu this can be done by running:

```
psql -h localhost -U evm_runners -f evm_runners_postgres_schema.sql
```
Where `evm_runners` is the user you're using in your server.

## Endpoints

- <b>User</b>
    - GET

     ```
     curl http://localhost:1337/users
     ```

    - GET BY ID

     ```
     curl http://localhost:1337/users/1
     ```

    - POST OR PUT

     ```
     curl -X POST http://localhost:1337/users \
     -H "Content-Type: application/json" \
     -d '{"name":"kyre"}' 
     ```

     This will create user `kyre`, if you want to update it use `-d '{ "id": 1, "name": "kyre_updated"}'`

    - DELETE

     ```
     curl -X DELETE http://localhost:1337/users/1
     ```

- <b>Level</b>
    - GET

     ```
     curl http://localhost:1337/levels
     ```

    - GET BY ID

     ```
     curl http://localhost:1337/levels/1
     ```

    - POST OR PUT

     ```
     curl -X POST http://localhost:1337/levels \
     -H "Content-Type: application/json" \
     -d '{"name":"Average", "position":1, "test_contract":"AverageTest" }' 
     ```
     This will create the level `Average`, this level is on position  `1`, meaning it is the first level. `AverageTest` is the name of the foundry test file.
     
     If you want to update it use `-d '{"id": 1, "name":"Average_updated", "position":2, "test_contract":"AverageTest_Updated" }' `

    - DELETE

     ```
     curl http://localhost:1337/levels/1
     ```

- <b>Submission</b>
    - GET

     ```
     curl http://localhost:1337/submissions
     ```

    - GET BY ID

     ```
     curl http://localhost:1337/submissions/1
     ```

    - POST OR PUT

     ```
     curl -X POST http://localhost:1337/submissions \
     -H "Content-Type: application/json" \
     -d '{ "bytecode": "0x608060...", "user_id": "1", "level_id": "3" }' 
     ```
     User with ID 1 is submitting a solution for level 3. This solution will be tested. If it passes the tests it is saved. If the user already has a solution for this level, it is updated.
     
### Run this application

1. Create `env` and then fill the needed variables

```
$ cp .env.example .env
```

2. Install dependencies

```
$ npm install
```

3. Run as dev

```
$ npm run dev
```