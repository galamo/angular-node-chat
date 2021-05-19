require("dotenv").config()
const http = require("http")
const express = require("express")
const socket = require("socket.io");
const { DH_UNABLE_TO_CHECK_GENERATOR } = require("constants");
const app = express();
const server = http.createServer(app)
const adminRouter = require("./routes/admin")
const socketCors = { cors: { origin: "*" } }
// const socketIoServer = new socket.Server(server, socketCors)
const socketObj = require("./index.socket");
socketObj.init(server, socketCors)
// app.use("/", adminRouter)

app.use("/", adminRouter)


server.listen(process.env.PORT, () => {
    console.log(`Listen to Port ${process.env.PORT}`)
})

