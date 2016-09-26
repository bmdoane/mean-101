'use strict'
// minimale server
// Express executes in the context of where your node modules directory
// MEAN app - NO res.render
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('client'))

// Route
// When someone make a request to /api/title return title
app.get('/api/title', (req, res) =>
	// Always send an object - json based on res.send
	res.json({ title: 'MEAN 101 from Node' })
)

app.listen(port, () => console.log(`Listening on port: ${port}`))