require("dotenv").config()
const http = require("http")
const express = require("express")
const socket = require("socket.io")
const app = express();
const server = http.createServer(app)

const socketCors = { cors: { origin: "*" } }
const socketIoServer = new socket.Server(server, socketCors)


app.get("/", (req, res) => {
    res.send("Http Server is working")
})

let clients = { "1": "all" }
socketIoServer.on("connection", (socket) => {
    console.log("New Connection Created")


    socket.on("disconnect", () => {
        console.log(` ${clients[socket.id]} User Disconnected`)
        socketIoServer.emit("messageToAll", `${new Date().toDateString()} ${clients[socket.id]} has disconnected`)
        delete clients[socket.id]
    })

    socket.on("initUser", (user) => {
        console.log("initUser", socket.id, user)
        clients[socket.id] = user;
        socket.broadcast.emit("messageToAll", `${clients[socket.id]}: has connected`)
        socketIoServer.emit("listOfUsers", _getClients())
        function _getClients() {
            const result = Object.entries(clients).map(([id, clientName]) => {
                return { clientName, id }
            })
            return result
        }
    })

    socket.on("message", (message) => {
        console.log(message)
        socketIoServer.emit("messageToAll", `${new Date().toDateString()} ${clients[socket.id]}: ${message}`)

    })


})


server.listen(process.env.PORT, () => {
    console.log(`Listen to Port ${process.env.PORT}`)
})