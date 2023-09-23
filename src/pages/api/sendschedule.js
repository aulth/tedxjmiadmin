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
export default async function handler(req, res) {
    corsHandler(req, res, async () => {
        // Handle the API request here
        const data = req.body;
        if(data.adminPin!=process.env.adminPin){
            return res.json({success:false, msg:"Unauthorized"})
        }
        const origin = req.headers['origin'];
        const allowedOrign = ['https://www.tedxjmi.org', 'http://127.0.0.1:5500',]
        // if(!allowedOrign.includes(origin)){
        //     return res.json({success:false, msg:"Unathorized"});
        // }
        try {
            // const ticket = await Ticket.findOne({email:data.email});
            const ticket = await Ticket.findOne({
                email: { $regex: new RegExp('^' + data.email + '$', 'i') }
              });
            const message = `    
            <div style="font-family:Arial,sans-serif;padding:4px"><div style="text-align:center;background-color:red;color:#fff;padding:10px"><div class="adM">
            </div><h1>Welcome to TEDxJMI</h1>
        </div>
        <div style="margin:20px">
            <h2>Good morning! ${ticket.name}</h2>
            <p>Here's the schedule for the day:</p>
            <table style="width:100%;border-collapse:collapse">
                <tbody><tr>
                    <th style="border:1px solid #dddddd;text-align:left;padding:8px">Time</th>
                    <th style="border:1px solid #dddddd;text-align:left;padding:8px">Event</th>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">08:30 AM - 11:00 AM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Entry</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">10:00 AM - 01:00 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Morning Sessions</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">01:00 PM - 02:00 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Lunch</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">02:00 PM - 05:00 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Afternoon Sessions</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">05:00 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Closing Ceremony</td>
                </tr>
            </tbody></table>
            <p>We hope you enjoy the day's events. If you have any questions or need assistance, please don't hesitate to ask.</p>
            <p>Best regards,</p>
            <p>TEDxJMI Organising Team</p></div></div>
        `
            const mailOption = {
                from: `TEDxJMI <pass.tedxjmi@gmail.com>`,
                to: ticket.email.toLowerCase(),
                subject: `Itinerary For The Day`,
                html: message,
                attachments: [
                    { path:  "https://register.tedxjmi.org/TEDXJMI%202023%20ITINERARY_20230922_203055_0000.pdf"}]
            };
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    return res.json({ success: false, msg: err.message, data })
                }
                return res.json({ success: true, msg: "Schedule Sent", data: ticket })
            });
        } catch (error) {
            return res.json({ success: false, msg: error.message, data })
        }
        // res.status(200).json({ name: 'John Doe' });
    });

}
