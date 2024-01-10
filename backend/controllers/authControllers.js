import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModal from '../models/userModal.js'
import DoctorModal from '../models/doctorModal.js'
import AdminModal from '../models/adminModal.js'
import asyncHandler from 'express-async-handler'

export const register = asyncHandler(async (req, res, next) => {
    let { name, email, password, phone, role } = req.body

    if (!name && !email && !password && !phone && !role) {
        return res.status(404).json({ status: 'error', message: "all Fields are Required" })
    }

    let isExist = await findUser(role, email)
    if (isExist) {
        return res.status(409).send({ status: 'error', message: email + " is already Register" })
    }
    const hashPassword = await bcrypt.hash(password, 10)

    if (role === 1) {
        let newUser = await new UserModal({ name, email, password: hashPassword, phone })
        await newUser.save()
        next()
    } else if (role === 2) {
        let newUser = await new DoctorModal({ name, email, password: hashPassword, phone })
        await newUser.save()
        next()
    } else if (role === 3) {
        let newUser = await new AdminModal({ name, email, password: hashPassword, phone })
        await newUser.save()
        next()
    } else {
        return res.status(404).json({ status: 'error', message: "Role is not Specified" })
    }
})

export const login = asyncHandler(async (req, res, next) => {
    let { email, password, role } = req.body

    if (!email && !password && !role) {
        return res.status(404).json({ status: 'error', message: "all Fields are Required" })
    }

    let isExist = await findUser(role, email)

    if (!isExist) {
        return res.status(404).send({ status: 'error', message: email + " is not Register" })
    }

    const passwordCheck = await bcrypt.compare(password, isExist.password)
    if (!passwordCheck) {
        return res.status(404).send({ status: 'error', message: "Check Your credentials, Password is Wrong" })
    }

    const refreshToken = jwt.sign({ email, role, _id: isExist._id }, process.env.REFRESH_TOKEN, { expiresIn: '1d' })
    const accessToken = jwt.sign({ email, role, _id: isExist._id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })

    if (!!req.body.stayLogin) {
        res.cookie(`REFRESH_TOKEN`, refreshToken, {
            sameSite: 'None',
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        })
    }

    delete isExist.password
    res.json({ status: "success", user: { ...isExist }, token: accessToken })
})

export const refresh = asyncHandler(async (req, res) => {
    let { REFRESH_TOKEN } = req.cookies

    if (!REFRESH_TOKEN) {
        return res.status(404).json({ status: 'error', message: "Please Login With credentials" })
    }

    jwt.verify(REFRESH_TOKEN, process.env.REFRESH_TOKEN, async (err, data) => {
        if (err) return res.status(400).json({ status: 'error', message: "Please Login With credentials" })

        let { role, email, _id } = data
        let isExist = await findUser(role, email, _id)

        if (!isExist) {
            return res.status(404).send({ status: 'error', message: email + " is something Wrong" })
        }

        const accessToken = jwt.sign({ email, role, _id }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })

        delete isExist.password
        res.json({ status: "success", user: { ...isExist }, token: accessToken })

    })
})

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie(`REFRESH_TOKEN`, {
        sameSite: 'None',
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ status: 'ok', message: "Logout Successfully" })

})

export const updatedata = asyncHandler(async (req, res) => {
    const role = req.params.role;
    const { email } = req.user;
    let providedData = req.body;

    let isExist = await findUser(role, email)

    if (!isExist) {
        return res.status(404).send({ status: 'error', message: email + " is not Register" })
    }

    const passwordCheck = await bcrypt.compare(providedData.password, isExist.password)
    if (!passwordCheck) {
        return res.status(404).send({ status: 'error', message: "Check Your credentials, Password is Wrong" })
    }
    delete providedData.password

    let newUser
    if (role === 1 || role == 'user') {
        newUser = await UserModal.updateOne({ _id: isExist._id }, {
            $set: {
                ...providedData
            }
        }, { new: true })
    } else if (role === 2 || role == 'doctor') {
        newUser = await new DoctorModal.updateOne({ _id: isExist._id }, {
            $set: {
                ...providedData
            }
        }, { new: true })
    } else if (role === 3 || role == 'admin') {
        newUser = await AdminModal.updateOne({ _id: isExist._id }, {
            $set: {
                ...providedData
            }
        }, { new: true })
    } else {
        return res.status(404).json({ status: 'error', message: "Role is not Specified" })
    }
    res.status(200).json({ status: "success", user: newUser })
})

async function findUser(role, email) {

    if (role === 1 || role == 'user') {
        return await UserModal.findOne({ email }).lean()
    } else if (role === 2 || role == 'doctor') {
        return await DoctorModal.findOne({ email }).lean()
    } else if (role === 3 || role == 'admin') {
        return await AdminModal.findOne({ email }).lean()
    } else {
        return false
    }
}