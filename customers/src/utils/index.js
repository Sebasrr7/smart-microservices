const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');

module.exports = {
    GenerateSalt: () => bcrypt.genSalt(),
    GeneratePassword: (password, salt) => bcrypt.hash(password, salt),
    ValidatePassword: (password, hash, salt) => bcrypt.hash(password, salt).then((value) => value === hash),
    GenerateSignature: (payload) => jwt.sign(payload, APP_SECRET, { expiresIn: '1d' }),
    FormateData: (data) => ({ data }),
};
