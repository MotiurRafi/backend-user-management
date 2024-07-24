const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')

app.use(bodyParser.json())
app.use(cors())

app.use('/api/users/', userRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
