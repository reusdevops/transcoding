const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
require('dotenv').config()

const PORT = process.env.PORT


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // <-- Your app password here
  },
});
const mailOptions = {
  from: process.env.EMAIL_PASSWORD,
  to: process.env.RECEIVER_EMAIL,
  subject: "Hello from Transcoding Worker!",
  text: "This email was sent using a Gmail app password. I receive an API call.",
};
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "/ route"
    })
})

app.post('/upload', (req, res) => {
    console.log('sent from:', mailOptions.from)
    console.log('sent to:', mailOptions.to)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).json({
        status: "receive message"
    })
})

app.get("/health", (req, res) => {
  return res.status(200).json({
    path: "/health",
    message: "health check route",
  });
});
app.listen(PORT, () => {
    console.log('server is listening on port :', PORT)
}
)