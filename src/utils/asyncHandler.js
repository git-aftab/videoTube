class ApiError extends Error{
    constructor (statusCode,errors=[],message){
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        if(stack){
            this.stack = this.stack
        }

    }
}