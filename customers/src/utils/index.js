const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');

const GenerateSalt = () => bcrypt.genSalt();

const GeneratePassword = (password, salt) =>
    bcrypt.hash(password, salt);

const ValidatePassword = (password, hash, salt) =>
    bcrypt.hash(password, salt).then((value) => value === hash);

const GenerateSignature = (payload) => {
    if (!APP_SECRET) {
        throw new Error('APP_SECRET is not configured');
    }

    return jwt.sign(payload, APP_SECRET, {
        expiresIn: '1d',
    });
};

const FormateData = (data) => ({
    data,
});

module.exports = {
    GenerateSalt,
    GeneratePassword,
    ValidatePassword,
    GenerateSignature,
    FormateData,
};