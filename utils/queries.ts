/* USERS */
export const SELECT_ALL_USERS_QUERY = "SELECT * FROM users";
export const SELECT_USER_BY_PIN_QUERY = "SELECT * FROM users WHERE pin = ";
export const SELECT_USER_BY_TOKEN_QUERY = "SELECT * FROM users WHERE access_token = ";
export const SELECT_USER_BY_ID_QUERY = "SELECT * FROM users WHERE id = ";

/* LEVELS */
export const SELECT_ALL_LEVELS_QUERY = "SELECT * FROM levels";
export const SELECT_LEVEL_BY_ID_QUERY = "SELECT * FROM levels WHERE id = ";
export const SELECT_TEST_FILE_BY_ID_QUERY = "SELECT test_contract FROM levels WHERE id = ";
export const SELECT_LEVEL_TOTAL_SOLUTIONS = "SELECT COUNT(id) FROM submissions WHERE level_id = ";
export const DELETE_LEVEL_QUERY = "DELETE FROM levels WHERE id = ";

/* SUBMISSION */
export const SELECT_ALL_SUBMISSIONS_QUERY = "SELECT * FROM submissions";
export const SELECT_SUBMISSION_BY_ID_QUERY = "SELECT * FROM submissions WHERE id = ";