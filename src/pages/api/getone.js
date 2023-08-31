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

    let tickets = await Ticket.findOne({ticketNumber:data.ticketNumber});
    if (!tickets) {
        return res.json({ success: false, msg: "Tickets Not Found" })
    }
    return res.json({ success: true, msg: "Ticket Found", name: tickets.name })
}
