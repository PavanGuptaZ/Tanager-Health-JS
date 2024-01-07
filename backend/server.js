import express from "express";
import mongoose from "mongoose";
import dotDev from 'dotenv';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import { logger } from './middleware/logger.js';
import connectDB from './config/dbConnection.js'
dotDev.config()

import { fileURLToPath } from "url";
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT;

import HomeRouter from './routers/homeRouter.js';
import AuthRouter from './routers/authRouter.js';

import errorHandler from './middleware/errorHandler.js'

const app = express()

connectDB()

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieparser())
app.use(logger)

app.use('/', HomeRouter)
app.use('/auth', AuthRouter)


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('text').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Database Connected')

    app.listen(PORT, () => {
        console.log('server started on ' + PORT)
    })
})

mongoose.connection.on('error', () => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})