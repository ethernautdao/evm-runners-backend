# evm-runners-backend

## Requirements

- Node.js v16.16.0
- NPM v8.11.0
- postgresql

## Setting up the environment

The server is expecting:
1. To connect to a postgresql database
    
    [Follow the docs](https://www.postgresql.org/docs/) and set up a postgres server on your system.
    After the server is up and running, create a database named `evm_runners`.
    Then, you can import the schema in the file `evm_runners_database_schema.sql`.
    As an example, in Ubuntu this can be done by running:

    ```
    psql -h localhost -U evm_runners -f evm_runners_postgres_schema.sql
    ```
    Where `evm_runners` is the user you're using in your server.

2. Discord Auth
   
   You'll need to access the [Discord Developer Portal](https://discord.com/developers/applications) and create an app.
   Still in the portal, set the app OAuth2 redirect link to `https://localhost:1337/auth/discord/`
   Finally, you'll need to place the `CLIENT_ID` and `CLIENT_SECRET` in the `.env`.
   This is the only way to create a new user.

## Endpoints

There are three types of endpoints:
1. Require no auth (ALL);
2. Require auth token (AUTH);
3. Require user to be an admin (ADMIN);

- <b>Auth</b>
    - AUTH (ALL)
    
    You'll need to open `http://localhost:1337/auth` in your browser and authorize the application, at which point the defined callback will be called and it will create your user. You will get a PIN as response, which you will need to get your access token.

- <b>User</b>
    - GET USER INFO (ALL)

     ```
     curl http://localhost:1337/users/info/PIN 
     ```

     This will return the information for the user with the given `PIN`.
     
    - GET ALL (ADMIN)

     ```
     curl -H "Authorization: Bearer {token}" http://localhost:1337/users
     ```

    - GET BY ID (ADMIN)

     ```
     curl -H "Authorization: Bearer {token}" http://localhost:1337/users/1
     ```

- <b>Level</b>
    - GET (ALL)

     ```
     curl http://localhost:1337/levels
     ```

    - GET BY ID (ALL)

     ```
     curl http://localhost:1337/levels/1
     ```


    - GET TOTAL SOLUTIONS (ALL)

     ```
     curl http://localhost:1337/levels/1/total
     ```

    - POST OR PUT (ADMIN)

     ```
     curl -X POST http://localhost:1337/levels \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"name":"Average", "position":1, "test_contract":"AverageTest" }' 
     ```
     If the token is for an user that is an admin, this will create the level `Average`, with position `1`, meaning it is the first level. `AverageTest` is the name of the foundry test file.
     
     If you want to update it use `-d '{"id": 1, "name":"Average_updated", "position":2, "test_contract":"AverageTest_Updated" }' `

    - DELETE (ADMIN)

     ```
     curl -H "Authorization: Bearer {token}" http://localhost:1337/levels/1
     ```

- <b>Submission</b>
    - GET (ADMIN)

     ```
     curl -H "Authorization: Bearer {token}" http://localhost:1337/submissions
     ```

    - GET BY ID (ADMIN)

     ```
     curl -H "Authorization: Bearer {token}" http://localhost:1337/submissions/1
     ```

    - GET GAS LEADERBOARD BY LEVEL ID (ALL)

     ```
     curl http://localhost:1337/submissions/leaderboard/gas/1
     ```

    - GET SIZE LEADERBOARD BY LEVEL ID (ALL)

     ```
     curl http://localhost:1337/submissions/leaderboard/size/1
     ```

    - POST OR PUT (AUTH)

     ```
     curl -X POST http://localhost:1337/submissions \
     -H "Authorization: Bearer {token}" \
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
