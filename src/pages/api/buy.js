// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "middleware/connectToDb";
import Ticket from "../../../models/Ticket";
import cors from 'cors';

connectToDb();
import { createTransport } from "nodemailer";
const key = process.env.key;
const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.email,
        pass: key
    },
});
const corsHandler = cors({
    origin: '*', // Replace with the allowed origin
    methods: ['POST'], // Adjust the allowed methods
});
function generateTicket() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let ticketNumber = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      ticketNumber += characters.charAt(randomIndex);
    }
  
    return ticketNumber;
  }
export default async function handler(req, res) {
    corsHandler(req, res, async () => {
        // Handle the API request here
        const data = req.body;
        if(!data.name){
            return res.json({success:false, msg:"Please enter name"});
        }
        if(!data.email){
            return res.json({success:false, msg:"Please enter name"});
        }
        if(!data.screenshot){
            return res.json({success:false, msg:"Oh Bhai paymnet?"});
        }
        if(data.adminPin!=process.env.adminPin){
            return res.json({success:false, msg:"Unauthorized"});
        }
        const origin = req.headers['origin'];
        const allowedOrign = ['https://www.tedxjmi.org', 'http://127.0.0.1:5500',]
        try {
            const ifExist = await Ticket.findOne({email:data.email.toLowerCase()});
            if(ifExist){
                return res.json({ success: false, msg: "Email already used", data })
            }
            const ticketNumber = generateTicket();

            const newTicket = await Ticket.create({
                ticketNumber: ticketNumber,
                name: data.name,
                email: data.email.toLowerCase(),
                used:false,
                sent:false,
                screenshot:data.screenshot,
                idCard:data.idCard
            })
            if (!newTicket) {
                return res.json({ success: false, msg: "Purchase failed", data })
            }
            const message = `Thanks for the registration, we will review and send you the ticket shortly.`
            const mailOption = {
                from: `TEDxJMI <noreply.tedxjmi@gmail.com>`,
                to: data.email.toLowerCase(),
                subject: `Registration Acknowledgment`,
                text: message
            };
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    return res.json({ success: false, msg: err.message, data })
                }
                return res.json({ success: true, msg: "Pass Booked", data: newTicket })
            });
        } catch (error) {
            return res.json({ success: false, msg: error.message, data })
        }
        // res.status(200).json({ name: 'John Doe' });
    });

}
