const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routers/user')
const skillRouter = require('./routers/skill')
const followRouter = require('./routers/follow')
const projectRouter = require('./routers/project')
const likeRouter = require('./routers/like')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(skillRouter)
app.use(followRouter)
app.use(projectRouter)
app.use(likeRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
