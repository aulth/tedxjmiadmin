// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";
connectToDb();
export default async function handler(req, res) {
    let tickets = await Ticket.find({})
    if (!tickets) {
        return res.json({ success: false, msg: "Tickets Not Found" })
    }
    return res.json({ success: true, msg: "Ticket Found", tickets: tickets })
}
