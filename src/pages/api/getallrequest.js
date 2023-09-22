// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";
connectToDb();
export default async function handler(req, res) {
    const data = req.body;
    if(data.adminPin!=process.env.adminPin){
        return res.json({success:false, msg:"Unauthorized"});
    }
    let tickets = await Ticket.find({})
    if (!tickets) {
        return res.json({ success: false, msg: "Tickets Not Found" })
    }
    tickets = tickets.filter(item=>!item.sent && !item.rejected);
    // tickets = tickets.filter(item => /^[A-Z]/.test(item.email));
    tickets = tickets.map((item)=>{
        return {
            "name":item.name, "email":item.email, "transactionId":item.transactionId, "idCard":item.idCard, "screenshot":item.screenshot, "mobile":item.mobile, "designation":item.designation
        }
    })
    return res.json({ success: true, msg: "Ticket Found", tickets: tickets })
}
