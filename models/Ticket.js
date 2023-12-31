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
    screenshot: String,
    idCard: String,
    transactionId: String,
    mobile: String,
    rejected:{
        type: Boolean,
        default: false
    },
    googleForm:{
        type: Boolean,
        default: false
    },
    designation:String
}, { timestamps: true })

mongoose.models = {};
export default mongoose.model('Ticket', Ticket);