// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";
import NextCors from 'nextjs-cors';

connectToDb();
export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.json({ success: false, msg: "Method not allowed" });
    }
    await NextCors(req, res, {
        methods: ['POST'],
        origin: 'https://www.tedxjmi.com',
        optionsSuccessStatus: 200,
    });
    const data = req.body;
    if (process.env.adminPin != data.adminPin) {
        return res.json({ success: false, msg: "Unauthorized" })
    }
    let tickets = await Ticket.findOne({ ticketNumber: data.ticketNumber });
    if (!tickets) {
        return res.json({ success: false, msg: "Invalid Ticket" })
    }
    if(tickets.used){
        return res.json({ success: false, msg: "Already used" })
    }
    //update the used attr
    await Ticket.findOneAndUpdate({ticketNumber:data.ticketNumber},{used:true});
    return res.json({ success: true, msg: "Ticket Found", name: tickets.name, email:tickets.email })
}
