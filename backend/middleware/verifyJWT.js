import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {

    const authHeaders = req.headers.authorization || req.headers.Authorization

    if (authHeaders || authHeaders?.startsWith('Bearer ')) {

        const ACCESS_TOKEN = authHeaders.split(' ')[1]

        jwt.verify(ACCESS_TOKEN, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                verifyRefreshToken(req, res, next)
            } else {
                req.user = decoded
                next()
            }

        })

    } else {
        verifyRefreshToken(req, res, next)
    }

    function verifyRefreshToken(req, res, next) {
        const { REFRESH_TOKEN } = req.cookies

        if (!REFRESH_TOKEN) {
            return res.status(404).json({ status: 'error', message: "Please Login With credentials" })
        }

        jwt.verify(REFRESH_TOKEN, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token verification failed" });
            }

            const accessToken = jwt.sign({ email: decoded.email, role: decoded.role, _id: decoded._id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res.setHeader(`ACCESS_TOKEN`, accessToken)

            req.user = decoded
            next()
        })

    }
}
export default verifyJWT