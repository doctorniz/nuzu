
import express from 'express'
import backend from './backend'
const PORT = 4000

const app = express();
const server = backend(app)

server.listen(PORT, (err) => {
    console.log(`Server listening at port ${PORT}`)
})



