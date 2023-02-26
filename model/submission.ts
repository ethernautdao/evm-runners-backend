import { ObjectId } from "mongodb";

export interface Submission {
    _id: ObjectId;
    user: ObjectId;
    level: ObjectId;
    bytecode: string;
};
