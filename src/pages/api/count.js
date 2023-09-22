// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";
connectToDb();
export default async function handler(req, res) {
    let tickets = await Ticket.find({})
    if (!tickets) {
        return res.json({ success: false, msg: "Tickets Not Found" })
    }
    const idSet = new Set();
    const unique = [];
    for (const obj of tickets) {
        if (idSet.has(obj.email.toLowerCase())) {
            // Duplicate id found, return false
        }else{
            idSet.add(obj.email.toLowerCase());
            unique.push(obj.email.toLowerCase());
        }
    }
    // return res.json({ success: true, msg: "Ticket Found", tickets: tickets })
    return res.json({success:false, count:unique.length})
}
