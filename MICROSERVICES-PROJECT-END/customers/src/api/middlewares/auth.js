const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../../config');
const { UnauthorizedError } = require('../../utils/app-errors');
module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return next(new UnauthorizedError('Missing authorization token'));
    try { req.user = jwt.verify(header.slice(7), APP_SECRET); next(); }
    catch (_) { next(new UnauthorizedError('Invalid or expired token')); }
};
