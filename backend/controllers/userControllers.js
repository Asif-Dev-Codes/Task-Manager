const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateJWTtoken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' })

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('All fields are mandatory')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateJWTtoken(user.id)
  })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateJWTtoken(user.id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const { id, name, email } = await User.findById(req.user.id).select('-password');
    res.status(200).json({ id, name, email });
});

module.exports = { registerUser, loginUser, getCurrentUser }