// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";

connectToDb();
export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.json({ success: false, msg: "Method not allowed" });
    }
    const data = req.body;
    if (process.env.adminPin != data.adminPin) {
        return res.json({ success: false, msg: "Unauthorized" })
    }
    let tickets = await Ticket.findOneAndUpdate({ email: data.email }, {rejected:true});
    if (!tickets) {
        return res.json({ success: false, msg: "Rejection failed" })
    }
    //update the used attr
    return res.json({ success: true, msg: "Rejected Successfully" })
}
