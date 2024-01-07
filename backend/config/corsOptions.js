import allowedOrigins from "./allowedOrigins.js"

const corsOptions = {
    origin: (origin, callBack) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callBack(null, true)
        } else {
            callBack(new Error('Not Allowed By CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 202
}

export default corsOptions