

// handle error in project (2)

 export class AppError extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode 
    }
}


