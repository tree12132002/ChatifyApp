import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import { ENV } from './env.js'
import { socketAuthMiddleware } from '../middlewares/socket.auth.middleware.js'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true
  }
})

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware)

// this is for storing online users
const userSocketMap = {} //userId -> Set of socket.ids

io.on('connection', socket => {
  console.log('A user connected', socket.user.fullName)

  const userId = socket.userId

  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set()
  }
  userSocketMap[userId].add(socket.id)

  // io.emit() is used to send events to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  // with socket.on we listen for events from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.user.fullName)
    userSocketMap[userId].delete(socket.id)

    if (userSocketMap[userId].size === 0) {
      delete userSocketMap[userId]
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, app, server }
