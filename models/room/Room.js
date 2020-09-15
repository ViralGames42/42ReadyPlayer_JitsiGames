const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    usuarios: {
        type:[mongoose.Schema.Types.ObjectId],
        required:true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    inviteCode: {
        type:String,
        default:"default"
    }
});

RoomSchema.statics.findByName = async (name, inviteCode) => {
    const room = await Room.findOne({name});
    if (!room) {
        throw new Error({ error: 'nombre de la sala invalido.' });
    }
    if (room.inviteCode != "default" && inviteCode === room.inviteCode) {
        return room;
    } else {
        throw new Error({ error: 'codigo de invitacion invalido.' })
    }
};

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;