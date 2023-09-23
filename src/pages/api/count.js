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
    const duplicate = [];
    const entered = [];
    for (const obj of tickets) {
        if (obj.used) {
            entered.push(obj.email.toLowerCase());
        }
        if (!idSet.has(obj.email.toLowerCase())) {
            // Duplicate id found, return false
            idSet.add(obj.email.toLowerCase());
            unique.push(obj.email.toLowerCase());
        } else {
            duplicate.push(obj.email.toLowerCase());
        }
    }
    // return res.json({ success: true, msg: "Ticket Found", tickets: tickets })
    return res.json({ success: false, count: unique.length, total: tickets.length, duplicate: duplicate.length, entered:entered.length })
}
