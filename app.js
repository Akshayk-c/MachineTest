const express = require('express')
const app = express()
const DbConnect = require('./database')

app.use(express.json())
DbConnect();

app.use("/api", require('./router/apiRouter.js'))
app.use("/entity", require('./router/entityRouter.js'))

app.listen(3000, () => {
    console.log('Server started ::')
})

module.exports = app