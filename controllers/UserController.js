const User = require('../models/user/User');

const userController = {};

userController.signup = async (req, res) => {
    if (req.body) {
        console.log(req.body);
        try {
            const user = new User();
            user.nombre = req.body.nombre;
            user.email = req.body.email;
            user.nickname = req.body.nickname;
            /*
            ** si queremos añadir token jwt añadir aqui
            */
            console.log(user);
            try {
                await user.save();
                res.status(201).json({
                    msg: "Usuario creado satisfactoriamente.",
                    body: {
                        user: user,
                        id: user._id
                    }
                });
            } catch (err) {
                return res.status(400).json({
                    msg: "Error al crear usuario. nickname o email en uso",
                    error: {
                        error: err
                    }
                });
            }
        } catch (err) {
            return res.status(400).json({
                msg: "Error al crear usuario.",
                error: {
                    error: err
                }
            });
        }
    }
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
                        user: user,
                        id: user._id
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