const socket = require("socket.io");

const socketEvents = {
    messageToAll: "messageToAll",
    privateMessage: "privateMessage"
}
let clients = { "ALL": "All" }
let socketIoServer;
function init(server, socketCors) {

    socketIoServer = new socket.Server(server, socketCors)

    socketIoServer.on("connection", (socket) => {
        console.log("New Connection Created")


        socket.on("disconnect", () => {
            console.log(` ${clients[socket.id]} User Disconnected`)
            socketIoServer.emit("messageToAll", `[${new Date().toDateString()}] ${clients[socket.id]} has disconnected`)
            delete clients[socket.id]
        })

        socket.on("privateMessage", (privateMessagePayload) => {
            const senderName = getClientName(socket.id);
            const { message, sendToUserId } = privateMessagePayload;
            console.log({ message, sendToUserId })
            if (!sendToUserId || !senderName) return;
            const sendToName = getClientName(sendToUserId)
            const messagePrefix = `[${new Date().toDateString()}] [Private From: ${senderName}]`
            socketIoServer.to(sendToUserId).emit("messageToAll", `${messagePrefix} ${message}`)
            socket.emit("messageToAll", `[${new Date().toDateString()}] [Private To: ${sendToName}]: ${message}`)
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
            socketIoServer.emit("messageToAll", `[${new Date().toDateString()}] ${clients[socket.id]}: ${message}`)

        })


    })

    function getClientName(socketId) {
        return clients[socketId];
    }

}

function getSocket() {
    return socketIoServer;
}

module.exports = { init, socketEvents, getSocket };