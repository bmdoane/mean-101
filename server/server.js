'use strict'
// minimale server
// Express executes in the context of where your node modules directory
// MEAN app - NO res.render
const express = require('express')
const mongoose = require('mongoose')
const { json } = require('body-parser')

const app = express()
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

// Most backend code is going to be db queries
app.post('/api/messages', (req, res, err) => {
  const msg = req.body
  Message
    .create(msg)
    .then(msg => res.json(msg))
    .catch(err)
})

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () =>
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
)

// app.get('/api/messages', (req, res) =>
//   res.json({
//     messages: [
//       {
//         author: 'Tiberious',
//         content: 'You suck Spock',
//       },
//       {
//         author: 'Spock',
//         content: 'That is highly illogical'
//       },
//       {
//         author: 'Red Shirt',
//         content: 'Scotty is dead'
//       }
//     ]
//   })
// )