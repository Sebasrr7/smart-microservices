const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};

class APIError extends Error {
    constructor(
        name,
        statusCode = STATUS_CODES.INTERNAL_ERROR,
        description = 'Internal server error'
    ) {
        super(description);

        this.name = name;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends APIError {
    constructor(message = 'Bad request') {
        super(
            'BadRequestError',
            STATUS_CODES.BAD_REQUEST,
            message
        );
    }
}

class NotFoundError extends APIError {
    constructor(message = 'Not found') {
        super(
            'NotFoundError',
            STATUS_CODES.NOT_FOUND,
            message
        );
    }
}

class UnauthorizedError extends APIError {
    constructor(message = 'Unauthorized') {
        super(
            'UnauthorizedError',
            STATUS_CODES.UNAUTHORIZED,
            message
        );
    }
}

module.exports = {
    STATUS_CODES,
    APIError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
};