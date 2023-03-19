export interface Submission {
    id: number | undefined;
    level_id: number;
    user_id: number;
    bytecode: string;
    gas: number;
    size: number;
};
