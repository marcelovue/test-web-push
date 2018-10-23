const express = require('express')
const socket = require('socket.io')
const webpush = require('web-push')

const vapidKeys = {
  public: 'BPccwxX5mwuaBQ-YGYDCpTHxBZuNk6sKik7OEus-ueT7YoOD4S8O97l0iIfWW1w1Z5bc89vbWKOa13XOE38ysE8',
  private: 'kRPU_ZjMGAKBuPZsQ1YGkOy17JZjAUjyj9o9qyck4l8'
}
webpush.setGCMAPIKey('AIzaSyBp3og7fbdQCnRR_pqQk-jfBazmjrtSC40')
webpush.setVapidDetails(
  'mailto:marcelosmtp@gmail.com',
  vapidKeys.public,
  vapidKeys.private
)
const app = express()
app.use(express.static(__dirname+'/public'))
let port = 6004
let server = app.listen(port, () => console.log(`App is running on port ${port}`))

const io = socket(server)

global.users = [/*<socket_hash>: { socket: <Socket>, user }*/]
global.gcms = {/*<user_name>: gcm*/}
io.on('connection', (socket) => {
  let { name } = socket.handshake.query
  users[socket.id] = {socket, user: { name }}

  socket.on('message', (data) => {
    Object.keys(gcms).map(name => {
      let gcm = gcms[name]
      if (name !== data.to) return;
      webpush.sendNotification(gcm, JSON.stringify(data))
        .catch(err => console.log(err))
    })
  })
  socket.on('subscribe', (data) => {
    // users[socket.id].gcm = data
    gcms[name] = data
  })
  socket.on('disconnect', () => {
    delete users[socket.id]
  })
})
