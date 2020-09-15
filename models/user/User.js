const mongoose = require('mongoose');
const validator = require('validator');
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

UserSchema.statics.findByCredentials = async (nickname, email) => {
    const user = await User.findOne({nickname});
    if (!user) {
        throw new Error({ error: 'invalid nickname.' });
    }
    if (user.email === email) {
        return user;
    } else {
        throw new Error({ error: 'email and nickname mismatch.' })
    }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;