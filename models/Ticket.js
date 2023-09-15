import mongoose from 'mongoose'
const Ticket = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    used:{
        type: Boolean,
        default:false
    },
    sent:{
        type: Boolean,
        default:false
    },
    screenshot: String
}, { timestamps: true })

mongoose.models = {};
export default mongoose.model('Ticket', Ticket);