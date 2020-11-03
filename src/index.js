const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routers/user')
const skillRouter = require('./routers/skill')
// const showcaseRouter = require('./routers/showcase')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(skillRouter)
// app.use(showcaseRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
