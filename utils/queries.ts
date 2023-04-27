/* USERS */
export const SELECT_ALL_USERS_QUERY = "SELECT * FROM users";
export const SELECT_USER_BY_PIN_QUERY = "SELECT * FROM users WHERE pin = ";
export const SELECT_USER_BY_TOKEN_QUERY = "SELECT * FROM users WHERE access_token = ";
export const SELECT_USER_BY_ID_QUERY = "SELECT * FROM users WHERE id = ";
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
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, u.name AS user_name,  u.discriminator AS discriminator, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.gas != 0 
    ORDER BY s.gas ASC, s.submitted_at ASC;
`;
export const SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY = `
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, u.name AS user_name, u.discriminator AS discriminator, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.size != 0 
    ORDER BY s.size ASC, s.submitted_at ASC;
`;
export const INSERT_OR_UPDATE_SUBMISSION_QUERY = `
    INSERT INTO submissions (level_id, user_id, bytecode, gas, size, submitted_at)
    VALUES($1, $2, $3, $4, $5, to_timestamp($6)) 
    ON CONFLICT (user_id, level_id) 
    DO UPDATE SET bytecode = EXCLUDED.bytecode, gas = EXCLUDED.gas, size = EXCLUDED.size, submitted_at = EXCLUDED.submitted_at
    RETURNING *;
`;
