// request-validation-error.ts
import { ValidationError } from "express-validator";

interface CustomError {
    statusCode: number;
    serializweErrors(): { message: string }[];
}   




export class RequestValidationError extends Error  {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super();

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map((error) => {
            return { message: error.msg};
        });
    }
}

