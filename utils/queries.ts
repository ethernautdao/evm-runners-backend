/* USERS */
export const SELECT_ALL_USERS_QUERY = "SELECT * FROM users";
export const SELECT_USER_BY_PIN_QUERY = "SELECT * FROM users WHERE pin = $1";
export const SELECT_USER_BY_TOKEN_QUERY = "SELECT * FROM users WHERE access_token = $1";
export const SELECT_USER_BY_ID_QUERY = "SELECT * FROM users WHERE id = $1";
export const INSERT_OR_UPDATE_USER_QUERY = `
    INSERT INTO users (pin, discord_id, name, discriminator, code, access_token, refresh_token, expires_in, admin)
    VALUES($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), $9) 
    ON CONFLICT (discord_id)
    DO UPDATE SET
        pin = EXCLUDED.pin,
        name = EXCLUDED.name, 
        discriminator = EXCLUDED.discriminator, 
        code = EXCLUDED.code, 
        access_token = EXCLUDED.access_token, 
        refresh_token = EXCLUDED.refresh_token, 
        expires_in = EXCLUDED.expires_in, 
        admin = EXCLUDED.admin
    RETURNING *;
`;
//export const DELETE_USER_QUERY = "DELETE FROM users WHERE id = ";

/* LEVELS */
export const SELECT_ALL_LEVELS_QUERY = "SELECT * FROM levels";
export const SELECT_LEVEL_BY_ID_QUERY = "SELECT * FROM levels WHERE id = $1";
export const SELECT_TEST_FILE_BY_ID_QUERY = "SELECT test_contract FROM levels WHERE id = $1";
export const SELECT_LEVEL_TOTAL_SOLUTIONS = "SELECT COUNT(id) FROM submissions WHERE level_id = $1";
export const INSERT_LEVEL_QUERY = `
    INSERT INTO levels (name, position, test_contract)
    VALUES($1, $2, $3)
    RETURNING *;
`;
export const UPDATE_LEVEL_QUERY = `
    INSERT INTO levels (id, name, position, test_contract)
    VALUES($1, $2, $3, $4) 
    ON CONFLICT (id)
    DO UPDATE SET name = EXCLUDED.name, position = EXCLUDED.position, test_contract = EXCLUDED.test_contract
    RETURNING *;
`;
export const DELETE_LEVEL_QUERY = "DELETE FROM levels WHERE id = $1";

/* SUBMISSION */
export const SELECT_ALL_SUBMISSIONS_QUERY = "SELECT * FROM submissions";
export const SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY = "SELECT s.* FROM submissions s INNER JOIN users u ON s.user_id = u.id WHERE u.access_token = $1 AND level_id = $2";
export const SELECT_SUBMISSION_BY_ID_QUERY = "SELECT * FROM submissions WHERE id = $1";
export const SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY = `
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, s.type, s.optimized_for, u.name AS user_name, u.discriminator AS discriminator, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.optimized_for = 'gas'
    ORDER BY s.gas ASC, s.submitted_at ASC;
`;
export const SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY = `
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, s.type, s.optimized_for, u.name AS user_name, u.discriminator AS discriminator, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.optimized_for = 'size'
    ORDER BY s.size ASC, s.submitted_at ASC;
`;
export const INSERT_OR_UPDATE_SUBMISSION_QUERY = `
    INSERT INTO submissions (level_id, user_id, bytecode, gas, size, submitted_at, type, optimized_for)
    VALUES ($1, $2, $3, $4, $5, to_timestamp($6), $7, 'gas'), ($1, $2, $3, $4, $5, to_timestamp($6), $7, 'size')
    ON CONFLICT (user_id, level_id, optimized_for)
    DO UPDATE SET bytecode = EXCLUDED.bytecode, gas = EXCLUDED.gas, size = EXCLUDED.size, submitted_at = EXCLUDED.submitted_at, type = EXCLUDED.type
    WHERE (EXCLUDED.optimized_for = 'gas' AND submissions.gas > EXCLUDED.gas) OR (EXCLUDED.optimized_for = 'size' AND submissions.size > EXCLUDED.size)
    RETURNING *;
`;
