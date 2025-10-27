const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
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

app.get('/presigned-url', async (req, res) => {


  const s3 = new S3Client({
    endpoint: process.env.CLOUDFLARE_ENDPOINT, // https://<account-id>.r2.cloudflarestorage.com
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY, // R2 Access Key ID
      secretAccessKey: process.env.R2_SECRET_KEY, // R2 Secret Access Key
    },
    region: "auto",
    signatureVersion: "v4",
  });

  const command = new PutObjectCommand({
    Bucket: 'video-streaming',
    Key: 'videos/sample-1.jpg',
    ContentType: 'image/jpeg'
  })

  
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return res.status(200).json({
    url: signedUrl
  })
})
app.post('/head-object', async (req, res) => {
const s3 = new S3Client({
  endpoint: process.env.CLOUDFLARE_ENDPOINT, // https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY, // R2 Access Key ID
    secretAccessKey: process.env.R2_SECRET_KEY, // R2 Secret Access Key
  },
  region: "auto",
  signatureVersion: "v4",
});
const result = await s3.send(new HeadObjectCommand({
  Bucket: "video-streaming",
  Key: "videos/3/thumbnails/sample-3.jpg"
}));

console.log(result.Metadata); // should log { "thumbnail-id": "3" }
return res.status(200).json({
  data: result
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