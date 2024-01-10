import PersonModal from '../models/personModal.js'
import asyncHandler from 'express-async-handler'

export const getPersonsList = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    let list = await PersonModal.find({ userId: _id }).lean()

    if (list.length < 1) return res.status(404).json({ message: "No Person Found" })

    res.status(200).json({ status: "success", list })
})

export const postPersons = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    let { profileIcon, name, relation, age } = req.body;

    let isExist = await PersonModal.findOne({ userId: _id, name })
    if (isExist) {
        return res.status(409).send({ status: 'error', message: name + " is already Exist in your account" })
    }

    if (!profileIcon && !name && !relation && !age) {
        return res.status(404).json({ status: "error", message: "All Fields are Required" })
    }

    let Person = new PersonModal({ profileIcon, name, relation, dateOfBirth: new Date(age), userId: _id })
    let newPerson = await Person.save()

    res.status(200).json({ status: "success", newPerson })
})