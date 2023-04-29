export enum SubmissionLanguage {
    "Solidity" = 0,
    "Huff" = 1,
    "Vyper" = 2
};

export interface Submission {
    id: number | undefined;
    level_id: number;
    level_name: string | undefined;
    user_id: number;
    user_name: string | undefined;
    bytecode: string;
    gas: number;
    size: number;
    submitted_at: number;
    language: string;
};
