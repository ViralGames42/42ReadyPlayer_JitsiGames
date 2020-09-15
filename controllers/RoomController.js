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
                        room: room
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
                await room.remove()
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

module.exports = roomController;