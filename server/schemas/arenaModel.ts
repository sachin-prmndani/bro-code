import mongoose from "mongoose";

let arenaRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    playerCount:{
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const ArenaRoom = mongoose.model("ArenaRoom", arenaRoomSchema);
export default ArenaRoom;