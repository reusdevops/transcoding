const express = require('express')

const app = express()
require('dotenv').config()

const PORT = process.env.PORT

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "/ route"
    })
})

app.post('/upload', (req, res) => {
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