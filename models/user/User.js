const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({
                    error: 'Invalid email address.'
                });
            }
        }
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;