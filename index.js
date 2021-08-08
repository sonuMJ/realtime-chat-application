const express = require('express')
const path =require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket => {

    const BotName = "InfinityChat bot";

    socket.on("joinroom", ({username, room}) =>{

            const user = userJoin(socket.id,username,room)

            socket.join(user.room)

            // welcome current user
            socket.emit("message", formatMessage(BotName,"Welcome to Chat"))

            //Broadcast when a user connects
            socket.broadcast
            .to(user.room)
            .emit("message", 
                formatMessage(BotName,`${user.username} has joined the chat`
            ))

            //send user info
            io.to(user.room).emit("roomUsers",{
                room : user.room,
                users:getRoomUsers(user.room)
            })
    })



    //client disconnet
    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit("message", formatMessage(BotName,`${user.username} has left the chat`))
        }

        //send user info
        io.to(user.room).emit("roomUsers",{
            room : user.room,
            users:getRoomUsers(user.room)
        })
        
    })

    //listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.emit("message", formatMessage(user.username,msg))
    })
})


server.listen(3000, ()=>console.log(`App running at 3000`))