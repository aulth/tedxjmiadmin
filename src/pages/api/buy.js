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
        if (!data.name) {
            return res.json({ success: false, msg: "Please enter name" });
        }
        if (!data.email) {
            return res.json({ success: false, msg: "Please enter name" });
        }
        if (!data.screenshot) {
            return res.json({ success: false, msg: "Oh Bhai paymnet?" });
        }
        if (data.adminPin != process.env.adminPin) {
            return res.json({ success: false, msg: "Unauthorized" });
        }
        const origin = req.headers['origin'];
        const allowedOrign = ['https://www.tedxjmi.org', 'http://127.0.0.1:5500',]
        try {
            const ifExist = await Ticket.findOne({ email: data.email.toLowerCase() });
            if (ifExist) {
                return res.json({ success: false, msg: "Email already used" })
            }
            const transactioId = await Ticket.findOne({ transactionId: data.transactionId });
            if (transactioId) {
                return res.json({ success: false, msg: "Please don't try scam with same transaction id" })
            }
            const ticketNumber = generateTicket();

            const newTicket = await Ticket.create({
                ticketNumber: ticketNumber,
                name: data.name,
                email: data.email.toLowerCase(),
                used: false,
                sent: false,
                screenshot: data.screenshot,
                idCard: data.idCard,
                transactionId: data.transactionId,
                mobile:data.mobile
            })
            if (!newTicket) {
                return res.json({ success: false, msg: "Purchase failed" })
            }
            const message = `
            <html>
                <body style="background-color: #FFF; color: #000; font-family: Arial, sans-serif;">
                    <p>Dear <b>${data.name}</b>,</p>
                    <p>Thank you for registering for <b>TEDx JMI</b>, scheduled for September 23rd. We are excited to have you join our event!</p>
                    
                    <p>Please note that the registration pass will be sent to you as soon as we have successfully verified your documents. We understand the urgency, and we're working diligently to ensure this process is completed swiftly.</p>
                    
                    <p>We appreciate your enthusiasm and kindly ask you to keep a close watch on your inbox for your registration pass.</p>
                    
                    <p style="color: #FF4500; font-weight: bold;">Once again we extend our heartfelt gratitude for being a part of TEDx JMI, and we can't wait to share this incredible experience with you!</p>
                    <br/>
                    <p>Best regards,</p>
                    <p style="font-weight:bold"><span style="color:#FF4500">Tedx</span>Jmi Organising team</p>
                </body>
            </html>
        `;
        


            const mailOption = {
                from: `TEDxJMI <noreply.tedxjmi@gmail.com>`,
                to: data.email.toLowerCase(),
                subject: `Registration Acknowledgment`,
                html: message
            };
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    return res.json({ success: false, msg: err.message })
                }
                return res.json({ success: true, msg: "Pass Booked", data: newTicket })
            });
        } catch (error) {
            return res.json({ success: false, msg: error.message })
        }
        // res.status(200).json({ name: 'John Doe' });
    });

}
