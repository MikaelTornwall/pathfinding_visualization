const express   = require('express')
const app       = express()

app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})