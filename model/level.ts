import { ObjectId } from "mongodb";

export interface Level {
    _id: ObjectId;
    name: string;
    position: number;
    test_contract: string;
};
