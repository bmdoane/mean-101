'use strict'
// Minimal server
// Express executes in the context of where your node modules directory
// MEAN app - NO res.render
const express = require('express')
const mongoose = require('mongoose')
const { json } = require('body-parser')
const { Server } = require('http') // Built in node http service
const socketio = require('socket.io')

const app = express()
// Creates secondary server to listen to web sockets
const server = Server(app)
// What we interact with
const io = socketio(server)

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/meanchat'
const PORT = process.env.PORT || 3000

// Middleware
// MEAN app - No url encoded forms, only json
app.use(express.static('client'))
app.use(json())

// Route
// When someone make a request to /api/title return title
app.get('/api/title', (req, res) =>
	// Always send an object - json based on res.send
	res.json({ title: 'MEAN Chat' })
)

const Message = mongoose.model('message', {
	author: 'String',
	content: 'String',
})

app.get('/api/messages', (req, res, err) =>
  Message
    .find()
    .then(messages => res.json({ messages }))
    .catch(err)
)

// Bundling all below into a function
app.post('/api/messages', createMessage)
// Most backend code is going to be db queries
// app.post('/api/messages', (req, res, err) => {
//   const msg = req.body
//   Message
//     .create(msg)
//     .then(msg => {
//       io.emit('newMessage', msg)
//       return msg // Returns message down change
//     })
//     // I'm responding with json, don't care what the client is
//     .then(msg => res.json(msg))
//     .catch(err)
// })

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () =>
  // Changed from app to server
  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
)

// When server connects the socket is the cb
// Different browser tabs log diff users with diff ids
io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log(`Socket diconnected: ${socket.id}`))
    socket.on('postMessage', createMessage)
  // socket.on('postMessage', msg =>
  //   Message
  //     .create(msg)
  //     .then(msg => io.emit('newMessage', msg))
  //     .catch(console.error)
  // )
})

function createMessage (reqOrMsg, res, next) {
  console.log("reqOrMsg", reqOrMsg);
  const msg = reqOrMsg.body || reqOrMsg
  Message
    .create(msg)
    .then(msg => {
      io.emit('newMessage', msg)
      return msg
    })
    .then(msg => res && res.status(201).json(msg))
    .catch(err => {
      if (next) {
        return next(err)
      }
      console.error(err)
    })
}
