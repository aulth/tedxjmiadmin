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
            const ticket = await Ticket.findOne({email:data.email});
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
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">09:00 AM - 10:30 AM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Opening Ceremony</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">10:45 AM - 12:30 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Morning Sessions</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">12:30 PM - 01:30 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Lunch</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">01:45 PM - 03:30 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Afternoon Sessions</td>
                </tr>
                <tr>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">03:45 PM - 05:00 PM</td>
                    <td style="border:1px solid #dddddd;text-align:left;padding:8px">Closing Remarks</td>
                </tr>
            </tbody></table>
            <p>We hope you enjoy the day's events. If you have any questions or need assistance, please don't hesitate to ask.</p>
            <p>Best regards,</p>
            <p>TEDxJMI Organising Team</p></div></div>
        `
            const mailOption = {
                from: `TEDxJMI <noreply.tedxjmi@gmail.com>`,
                to: data.email.toLowerCase(),
                subject: `Schedule - TEDxJMI`,
                html: message
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
