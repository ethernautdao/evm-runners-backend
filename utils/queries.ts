/* LEVELS */
export const SELECT_ALL_LEVELS_QUERY = "SELECT id, name, position FROM levels";
export const SELECT_LEVEL_BY_ID_QUERY = "SELECT id, name, position FROM levels WHERE id = ";
export const SELECT_TEST_FILE_BY_ID_QUERY = "SELECT test_contract FROM levels WHERE id = ";

/* SUBMISSION */
export const SELECT_ALL_SUBMISSIONS_QUERY = "SELECT * FROM submissions";
export const SELECT_SUBMISSION_BY_ID_QUERY = "SELECT * FROM submissions WHERE id = ";