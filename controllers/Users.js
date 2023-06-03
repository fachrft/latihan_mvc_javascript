import User from '../models/UserModel.js';
import argon from 'argon2'

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes:['uuid', 'name', 'email', 'role']
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes:['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
export const createUser = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    if (password !== confirmPassword) return res.status(400).json({msg: 'Invalid password'})
    const hashPassword = await argon.hash(password);

    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        if(email === User.email) return res.status(400).json({msg: 'Email already'})
        res.status(201).json({msg: 'Register successful'})
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if(!user) return res.status(404).json({msg: 'User not found' })

    const { name, email, password, confirmPassword, role } = req.body;
    let hashPassword;
    if(password === '' || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon.hash(password);
    }
    if (password !== confirmPassword) {
        res.status(400).json({msg: 'Invalid password'})
    } 
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        })
        res.status(200).json({msg: 'Updated successful'})
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}
export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if(!user) return res.status(404).json({msg: 'User not found' })
    
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({msg: 'Updated successful'})
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}