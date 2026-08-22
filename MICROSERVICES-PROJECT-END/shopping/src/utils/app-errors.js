class APIError extends Error { constructor(name, statusCode=500, message='Internal server error'){ super(message); this.name=name; this.statusCode=statusCode; } }
class BadRequestError extends APIError { constructor(message='Bad request'){ super('BadRequestError',400,message); } }
class UnauthorizedError extends APIError { constructor(message='Unauthorized'){ super('UnauthorizedError',401,message); } }
module.exports = { APIError, BadRequestError, UnauthorizedError };
