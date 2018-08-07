import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

export default (app) => {
    app.use('/file', express.static('public'))
    //app.use(morgan('combined'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(cors())
    return app
}