import jwt from "jsonwebtoken";
import UserModal from '../models/userModal.js'

const verifyJWT = async (req, res, next) => {
    const { ACCESS_TOKEN, REFRESH_TOKEN } = req.cookies

    const verifyToken = async (token, secret, message) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) {
                    return reject({ status: 403, message })
                }
                const userSearch = await UserModal.findOne({ email: decoded.email }).lean().exec()
                if (!userSearch) {
                    return reject({ status: 403, message: "user is not Register" })
                }

                delete userSearch.password
                resolve(userSearch)
            })
        })
    }
    try {
        if (!ACCESS_TOKEN && !REFRESH_TOKEN) {
            throw { status: 401, message: 'Unauthorization, please Login Again' }
        }
        let user
        if (ACCESS_TOKEN) {
            user = await verifyToken(ACCESS_TOKEN, process.env.ACCESS_TOKEN, "Forbidden, something went Wrong, refresh and try again")

        } else {
            user = await verifyToken(REFRESH_TOKEN, process.env.REFRESH_TOKEN, "Forbidden, something went Wrong, Login Again")

            const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res.cookie(`ACCESS_TOKEN`, accessToken, {
                // sameSite: 'None',
                maxAge: 1 * 24 * 60 * 1000,
                httpOnly: true,
                // secure: false,
            })
        }

        req.user = user
        next()

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ message: error.message });
    }
}
export default verifyJWT