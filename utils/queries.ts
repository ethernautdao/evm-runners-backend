/* USERS */
export const SELECT_ALL_USERS_QUERY = "SELECT * FROM users";
export const SELECT_USER_BY_PIN_QUERY = "SELECT * FROM users WHERE pin = $1";
export const SELECT_USER_BY_TOKEN_QUERY =
  "SELECT * FROM users WHERE access_token = $1";
export const SELECT_USER_BY_ID_QUERY = "SELECT * FROM users WHERE id = $1";
export const INSERT_OR_UPDATE_USER_QUERY = `
    INSERT INTO users (pin, discord_id, name, code, access_token, refresh_token, expires_in, admin)
    VALUES($1, $2, $3, $4, $5, $6, to_timestamp($7), $8) 
    ON CONFLICT (discord_id)
    DO UPDATE SET
        pin = EXCLUDED.pin,
        name = EXCLUDED.name, 
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
export const SELECT_TEST_FILE_BY_ID_QUERY =
  "SELECT test_contract FROM levels WHERE id = $1";
export const SELECT_LEVEL_TOTAL_SOLUTIONS =
  "SELECT COUNT(DISTINCT user_id) FROM submissions WHERE level_id = $1";
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
export const SELECT_ALL_SUBMISSIONS_QUERY =
  "SELECT s.*, u.name AS user_name FROM submissions s JOIN users u ON s.user_id = u.id";
export const SELECT_SUBMISSION_BY_TOKEN_QUERY =
  "SELECT s.*, u.name AS user_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE u.access_token = $1";
export const SELECT_SUBMISSION_BY_ID_QUERY =
  "SELECT s.*, u.name AS user_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE id = $1";
export const SELECT_SUBMISSION_BY_BYTECODE_AND_LEVEL_QUERY =
  "SELECT s.*, u.name AS user_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE bytecode = $1 AND level_id = $2";
export const SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY = `
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, s.type, s.optimized_for, u.name AS user_name, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.optimized_for = 'gas'
    ORDER BY s.gas ASC, s.submitted_at ASC;
`;
export const SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY = `
    SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, s.type, s.optimized_for, u.name AS user_name, l.name AS level_name
    FROM submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN levels l ON s.level_id = l.id 
    WHERE s.level_id = $1 AND s.optimized_for = 'size'
    ORDER BY s.size ASC, s.submitted_at ASC;
`;
export const INSERT_OR_UPDATE_SUBMISSION_QUERY = `
    WITH 
    new_submissions AS (
        INSERT INTO submissions (level_id, user_id, bytecode, gas, size, submitted_at, type, optimized_for)
        VALUES ($1, $2, $3, $4, $5, to_timestamp($6), $7, 'gas'), ($1, $2, $3, $4, $5, to_timestamp($6), $7, 'size')
        ON CONFLICT (user_id, level_id, optimized_for)
        DO UPDATE SET bytecode = EXCLUDED.bytecode, gas = EXCLUDED.gas, size = EXCLUDED.size, submitted_at = EXCLUDED.submitted_at, type = EXCLUDED.type
        WHERE (EXCLUDED.optimized_for = 'gas' AND submissions.gas > EXCLUDED.gas) OR (EXCLUDED.optimized_for = 'size' AND submissions.size > EXCLUDED.size)
        RETURNING *
    ),
    best_gas_submission AS (
        SELECT id, gas, submitted_at
        FROM (
            SELECT id, submitted_at, gas,
                RANK() OVER (ORDER BY gas ASC, submitted_at ASC) as rank
            FROM (
                SELECT id, submitted_at, gas
                FROM new_submissions
                WHERE optimized_for = 'gas'
                UNION
                SELECT id, submitted_at, gas
                FROM submissions
                WHERE optimized_for = 'gas' AND level_id = $1 AND user_id = $2
            ) s1
        ) s2
        WHERE s2.rank = 1
    ),
    best_size_submission AS (
        SELECT id, size, submitted_at
        FROM (
            SELECT id, submitted_at, size,
                RANK() OVER (ORDER BY size ASC, submitted_at ASC) as rank
            FROM (
                SELECT id, submitted_at, size
                FROM new_submissions
                WHERE optimized_for = 'size'
                UNION
                SELECT id, submitted_at, size
                FROM submissions
                WHERE optimized_for = 'size' AND level_id = $1 AND user_id = $2
            ) s1
        ) s2
        WHERE s2.rank = 1
    ), 
    gas_rank AS (
        SELECT COUNT(*) + 1
        FROM submissions s2 
        WHERE 
            s2.optimized_for = 'gas' AND 
            s2.level_id = $1 AND
            s2.user_id != $2 AND
            (s2.gas < (SELECT gas FROM best_gas_submission) OR 
            (s2.gas = (SELECT gas FROM best_gas_submission) AND 
            s2.submitted_at <= (SELECT submitted_at FROM best_gas_submission)))
    ),
    size_rank AS (
        SELECT COUNT(*) + 1
        FROM submissions s3 
        WHERE 
            s3.optimized_for = 'size' AND
            s3.level_id = $1 AND
            s3.user_id != $2 AND
            (s3.size < (SELECT size FROM best_size_submission) OR 
            (s3.size = (SELECT size FROM best_size_submission) AND 
            s3.submitted_at <= (SELECT submitted_at FROM best_size_submission)))
    )

    SELECT json_agg(row_to_json(new_submissions)) AS submissions, 
        (SELECT * FROM gas_rank) as gas_rank,
        (SELECT * FROM size_rank) as size_rank
    FROM new_submissions;
`;
