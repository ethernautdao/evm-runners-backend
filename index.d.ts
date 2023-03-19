import { Submission } from "./model/submission";

declare global {
    namespace Express {
        export interface Request {
            submission: Submission;
        }
    }
};
