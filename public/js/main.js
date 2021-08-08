const charForm = document.getElementById('chat-form')
const chatMessages =document.querySelector(".chat-messages")
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

console.log(username, room)

const socket = io();


//join chat room
socket.emit('joinroom', {username, room})

//
socket.on("roomUsers", ({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
})

//message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

charForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus()
})

//message to dom
function outputMessage(message){
    const div = document.createElement("div")
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector(".chat-messages").appendChild(div);
}

//add room name
function outputRoomName(room){
    roomName.innerHTML = room
}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    
    `
}