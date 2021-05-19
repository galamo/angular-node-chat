const express = require("express")
const { socketEvents } = require("../index.socket")
const router = express.Router();



router.get("/adminMessage", (req, res, next) => {
    const { message } = req.query;
    const { getSocket } = require("../index.socket")
    getSocket().emit(socketEvents.messageToAll, `[Admin] ${message}`)

    res.send(`message: ${message} send to all users;`)
})


module.exports = router;