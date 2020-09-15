const Room = require('../models/room/Room');
const User = require('../models/user/User');

const roomController = {};

roomController.create = async(req, res)=> {
    if(req.body) {
        try {
            const{id, name} = req.body;
            const room = new Room();
            console.log(room);
            room.name = name;
            if (req.body.inviteCode) {
                room.inviteCode = req.body.inviteCode;
            }
            let user = await User.findById(id);
            if (!user) {
                return res.status(400).json({
                    msg: "error al crear sala usuario desconocido."
                });
            } else {
                room.usuarios.push(user);
                await room.save();
                res.status(201).json({
                    msg: "Sala creada satisfactoriamente.",
                    body: {
                        room: room,
                        name: name
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                msg: "Error al crear sala.",
                error: {
                    error: err
                }
            });
        }
    }
};

roomController.destroy = async(req, res) => {
    if(req.body) {
        try {
            let room = await Room.findById(req.params.id);
            if (!room) {
                return res.status(400).json({
                    msg: "error al eliminar la sala. no existe."
                });
            } else {
                await room.remove();
            }
        } catch (err) {
            return res.status(400).json({
                msg: "Error al crear sala.",
                error: {
                    error: err
                }
            });
        }
    }
};

roomController.addUser = async(req, res) => {
    if (req.body) {
        const {inviteCode, id, roomName} = req.body;
        try {
            let room = await Room.findOne({name: roomName});
            if (!room) {
                res.status(400).json({
                    msg: "error al acceder a la sala."
                });
            } else {
                let user = await User.findById(id);
                if (!user) {
                    res.status(400).json({
                        msg: "error con el usuario."
                    });
                } else {
                    if (room.inviteCode !== "default" && room.invitecode !== inviteCode) {
                        res.status(400).json({
                            msg: "error con el codigo de invitacion."
                        });
                    } else {
                        room.usuarios.push(user);
                        await room.save();
                        res.status(200).json({
                            msg: "usuario añadido a la sala.",
                            body: {
                                room: room,
                                id: room._id
                            }
                        });
                    }
                }
            }
        } catch (err) {
            res.status(400).json({
                msg: "error con el usuario."
            });
        }
    }
};

module.exports = roomController;