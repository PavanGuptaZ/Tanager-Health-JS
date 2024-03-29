import rateLimit from 'express-rate-limit'
import { logEvents } from './logger.js'

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1min
    max: 5, //Limit each IP to 5 login requests per *window' per minute
    message: { status: 'error', message: 'Too many Login attempts from this IP, please try again after a 60 seconds pause' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //Return rate limit info in the `ratelimit-*` headers
    legacyHeaders: false, //disable the X-rateLimmit-* headers
})

export default loginLimiter