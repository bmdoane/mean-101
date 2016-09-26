'use strict'
// minimale server
// Express executes in the context of where your node modules directory
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

//app.set('port', port)

app.use(express.static('client'))

app.listen(port, () => console.log(`Listening on port: ${port}`))