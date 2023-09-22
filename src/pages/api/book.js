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
        if(data.adminPin!=process.env.adminPin){
            return res.json({success:false, msg:"Unauthorized"});
        }
        const origin = req.headers['origin'];
        const allowedOrign = ['https://www.tedxjmi.org', 'http://127.0.0.1:5500',]
        // if(!allowedOrign.includes(origin)){
        //     return res.json({success:false, msg:"Unathorized"});
        // }
        try {
            if(!data.email){
                return res.json({ success: false, msg: "Email missing", data })
            }
            const ifExist = await Ticket.findOne({email:data.email.toLowerCase()});
            if(ifExist){
                return res.json({ success: false, msg: "Email already used", data })
            }
            const ticketNumber = generateTicket();
            data.adminPin = "";
            if(!data.name){
                return res.json({ success: false, msg: "Name missing", data })
            }
            if(!data.screenshot){
                return res.json({ success: false, msg: "Payment Screenshot missing", data })
            }
            // if(!data.idCard){
            //     return res.json({ success: false, msg: "ID missing", data })
            // }
            // if(!data.mobile){
            //     return res.json({ success: false, msg: "Mobile No missing", data })
            // }
            const newTicket = await Ticket.create({
                ticketNumber: ticketNumber,
                name: data.name,
                email: data.email.toLowerCase(),
                used:false,
                sent:true,
                screenshot: data.screenshot,
                idCard: data.idCard,
                transactionId: data.transactionId,
                mobile:data.mobile,
                googleForm:true
            })
            if (!newTicket) {
                return res.json({ success: false, msg: "Booking failed", data })
            }
            const message = `    
        <div style="margin:0px;padding:0px">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%"
        style="margin:0 auto;text-align:center;font-family:open sans,helvetica neue,sans-serif">
        <tbody>
            <tr>
                <td align="center" height="100%" width="600">
                    <table border="0" cellpadding="0" cellspacing="0" style="background:#fff">
                        <tbody>
                            <tr>
                                <td width="600" style="background:#fff">
                                    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center"
                                        width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="background-color:#381d48;height:5px"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:38px 10px 0px;font-size:24px;color:red;line-height:30px;font-weight:bold;text-transform:capitalize"
                                                    width="600">Hi, ${data.name} </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="font-size:14px;font-weight:700;line-height:23px;text-align:center;padding:13px 10px 25px;">
                                                    Thank you for registering for <b style="color:red">TEDx<span
                                                            class="il">JMI</span>.</b><br>Your entrance
                                                    pass is here</td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top:0px;padding-bottom:10px;">
                                                    <div style="border: 1px solid #e7e3e3;width: 440px;margin: auto;">
                                                        <a href="#">
                                                        <img src="https://www.tedxjmi.org/res/images/ticket/header.jpg"
                                                        style="width:440px;"
                                                        alt="" data-bit="iit" tabindex="0">
                                                        </a>
                                                        <div
                                                            style="width: 440px;border-bottom: 1px solid #e7e3e3;margin:auto;height:350px;display: flex;justify-content: center;align-items: center;;">
                                                            <img style="margin: auto;width: 150px;"
                                                                src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}'/>
                                                        </div>
                                                        <div
                                                            style="width: 440px;margin:auto;">
                                                            <h3
                                                                style="text-align: center;font-weight: bold;font-size: large;color: red;">
                                                                ${data.name}</h3>
                                                            <p style="text-align: center;">23 September 2023</p>
                                                            <p style="text-align: center;">Entry Time: 8:30 to 11:00 AM</p>
                                                            <p style="text-align: center;">M.A. Ansari Auditorium, Jamia
                                                                Millia Islamia, New Delhi - India</p>
                                                            <p style="text-align: center;font-size: x-small;">Single
                                                                Entry-Non transferable</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="margin:0 auto;font-size:14px;line-height:23px;color:#908f8f;text-align:center;padding:10px 0px 25px 0">
                                                    Note: Please keep your pass handy to make your entrance
                                                    hassle-free. </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="600">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                        style="text-align:center;background:#381d48">
                                        <tbody>
                                            <tr>
                                                <td style="font-size:14px;line-height:23px;padding:20px 5px 12px;color:#fff;line-height:16px"
                                                    width="600">Follow Us On </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0 10px 0;margin:0px auto" width="600">
                                                    <a href="https://facebook.com/tedxjmi"
                                                        style="display:inline-block;text-decoration:underline;border:0"
                                                        target="_blank"
                                                        data-saferedirecturl="https://www.google.com/url?q=http://transmail.ftrans01.com/VDLFBOQERMCI?id%3D62306%3DdRoCU1dRCwUHTgUEDloDVQZRVAkFBgFSUQBSBlteBlZTAAUHVlpeAlUHUVIBCwtRBQYaVVpbURBAVQBYFkFZFnYBXwIIDxZWXl9PBgEPBgUGVF8PBwMAUAIBUgNEUEIXRlwdTBURWVtCX1JeWxdUQ0UCCEsFAhsGXFVOYHx0cCF5N3cxLCBxClhWT0EE%26fl%3DXhJGExJZFxpGRUQZUVhRUlUMCVMbUFoIHHIARVBWUzFTDVoXAEw%3D&amp;source=gmail&amp;ust=1693408335602000&amp;usg=AOvVaw1MyAqsaWehkgAVzdqM_9DW"><img
                                                            src="https://ci4.googleusercontent.com/proxy/iuH7gCbh2CP9RB7GDNUFs9ZssvquPLbvSCdxMnq33gan-aMjWFdnDB-fUOd-h7ZNY9uQSDgtAsUqGs3uvrdB3IGQTwA5U0rJYoHs-FaCCniVQvRg-1U_4RFakLM=s0-d-e1-ft#http://jashnerekhta.org/wp-content/themes/jer/assets/img/newsFacebook.png"
                                                            alt="facebook" border="0" class="CToWUd" data-bit="iit"></a>
                                                    <a href="http://twitter.com/tedxjmi"
                                                        style="display:inline-block;text-decoration:underline;border:0"
                                                        target="_blank"
                                                        data-saferedirecturl="https://www.google.com/url?q=http://transmail.ftrans01.com/VDLFBOQERMCI?id%3D62306%3DdRoCU1dRCwUHTgIPB10GUQEGVglTB1FSUQ9VUA8NAwJTX1cAAFIIV1JQUQMHDVFSD1UaVVpbURBAVQBYFkFZFnYBXwIIDxZWXl9PBgEPBgUGVF8PBwMAUAIBUgNEUEIXRlwdTBURWVtCX1JeWxdUQ0UCCEsFAhsGXFVOYHx0cCF5N3cxLCBxClhWT0EE%26fl%3DXhJGExJZFxpFRVpDQ1xAGVQMCxd/UkYNXV0zU1NQQgI%3D&amp;source=gmail&amp;ust=1693408335602000&amp;usg=AOvVaw2QS-xJcg3omnCMG0QmL98k"><img
                                                            src="https://ci6.googleusercontent.com/proxy/OotuoTllvFjna7jhWkszUpNE-gEDGvUkdIibgN4yuWTsr75q9rJqiEASsFjaxnb6vSkJO_PskfcVuDo7XsMCgIx0c1D6TrT8tV306Yrv2NQQh6J2DbK9yx7E7g=s0-d-e1-ft#http://jashnerekhta.org/wp-content/themes/jer/assets/img/newsTwitter.png"
                                                            alt="twitter" border="0" class="CToWUd" data-bit="iit"></a>
                                                    <a href="https://instagram.com/tedxjmi"
                                                        style="display:inline-block;text-decoration:underline;border:0"
                                                        target="_blank"
                                                        data-saferedirecturl="https://www.google.com/url?q=http://transmail.ftrans01.com/VDLFBOQERMCI?id%3D62306%3DdRoCU1dRCwUHTgAHVAxUUQMFBQ5TUAdVVllXAw0IV1NTAgoGBVUKAAAEUQZTDAEOAQUaVVpbURBAVQBYFkFZFnYBXwIIDxZWXl9PBgEPBgUGVF8PBwMAUAIBUgNEUEIXRlwdTBURWVtCX1JeWxdUQ0UCCEsFAhsGXFVOYHx0cCF5N3cxLCBxClhWT0EE%26fl%3DXhJGExJZFxpGRUQZXldBQ1YEFFlYHVYKXhcLV0tQWAZEA1kLFQJXU1dbUF5WVR0%3D&amp;source=gmail&amp;ust=1693408335602000&amp;usg=AOvVaw3C5GFYqFAYx3lk3EdBSnIP"><img
                                                            src="https://ci3.googleusercontent.com/proxy/_KToDl_e5uAMTvH5gBQUOH8GHfZw9MJe-P7fbOyFGtXTb__QsbYOw7O_Rqe0F06s3RARAVFLc0SOqJjATYAzgpLv7dAm5H9duYHZuAsKX-cFAQ7eMo-wv0TE3tP_=s0-d-e1-ft#http://jashnerekhta.org/wp-content/themes/jer/assets/img/newsInstagram.png"
                                                            alt="instagram" border="0" class="CToWUd"
                                                            data-bit="iit"></a>
                                                </td>
                                            </tr>
                                            <tr> </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <img src="https://ci6.googleusercontent.com/proxy/9drWdxNX6y6njSoBk5CqTXkPh69ULtcVQw2Y6UQijCb7PLVrNlMCUTJFOk33hxhTOvTcK_qdTO4OC1JcAP9__VpvOO_cdi-8n-dIt30Z4fLE8qfsgTNPpF4IcCU8x-lOLtAGg1PtLU6CqDMThEI5nLreut02vUF2AUvCDnuFTvn6gVoii0NPzyd4hDcaLapsZ653cKMjO1_wRcAFqVfhYR1THjbaX0cy-N7xU9mRkgJNPtbzd67rssPhJTrjaSa06iKkaVRQOnruTv-DYX8197LcVN1XJWach2yoBHjNwf-Tax_UZg0lQmU7_fbTP9opVyFo5ICkS56Sv6yMSe95cJ0wNXc=s0-d-e1-ft#http://transmail.ftrans01.com/VDLFBOQERMCI?id=62306=eRoCU1dRCwUHThMXFxkSFxdDRhgVExVFExhBFhgYFkMWRhJDQUMYFRESExcXGRIXF1MaVVpbURBAVQBYFkFZFnYBXwIIDxZWXl9PBgEPBgUGVF8PBwMAUAIBUgNEUEIXRlwdTBURWVtCX1JeWxdUQ0UCCEsFAhsGXFVOYHx0cCF5N3cxLCBxClhWT0EE"
        alt="" class="CToWUd" data-bit="iit">
</div>
        `
            const mailOption = {
                from: `TEDxJMI <noreply.tedxjmi@gmail.com>`,
                to: data.email.toLowerCase(),
                subject: `Registration Pass`,
                html: message
            };
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    return res.json({ success: false, msg: err.message, data })
                }
                return res.json({ success: true, msg: "Pass Sent", data: newTicket })
            });
        } catch (error) {
            return res.json({ success: false, msg: error.message, data })
        }
        // res.status(200).json({ name: 'John Doe' });
    });

}
