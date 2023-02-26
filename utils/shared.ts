import { ObjectId } from "mongodb";

export const isValidId = (id: any) => {
    try {
        return new ObjectId(id);
    } catch {
        return undefined;
    }
};
