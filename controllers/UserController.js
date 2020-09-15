const User = require('../models/user/User');

const userController = {};

userController.signup = async (req, res) => {
    if (req.body) {
        try {
            const user = new User(req.body);
            /*
            ** si queremos añadir token jwt añadir aqui
            */
            await user.save();
            res.status(201).json({
                msg: "Usuario creado satisfactoriamente.",
                body: {
                    user: user
                }
            });
        } catch (err) {
            res.status(400).json({
                msg: "Error al crear usuario.",
                error: {
                    error: err
                }
            });
        }
    }
    res.status(400).json({
        msg: "Error. Form vacío"
    });
};

userController.login = async (req, res) => {
    if (req.body){
        try {
            const {nickname, email} = req.body;
            const user = await User.findByCredentials(nickname, email);
            if (!user) {
                return res.status(400).json({
                    msg: "Error de credenciales, usuario no encontrado."
                });
            } else {
                res.status(201).json({
                    msg: "Login correcto.",
                    body: {
                        user: user
                    }
                });
            }
        } catch (err) {
            return res.status(401).json({
                msg: "Error de credenciales.",
                error: {
                    error: err
                }
            });
        }
    
    
    }
    res.status(400).json({
        msg: "Error. Form vacío"
    });
};


module.exports = userController;