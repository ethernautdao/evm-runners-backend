import { ObjectId } from "mongodb";

export const isValidId = (id: any) => {
    try {
        return ObjectId.isValid(id);
    } catch {
        return false;
    }
};
