const express = require('express')
const router = express.Router()
const { userModel } = require('../models/userModel')
const jwt = require('jsonwebtoken');

// Register new user
router.post('/register', async (req, res) => {
  console.log('Registering new user')
  try {
    const { username, email, password } = req.body
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { username }] 
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      })
    }

    const user = new userModel({
      username,
      email,
      password
    })

    await user.save()
    
    // Create token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({ user, token })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router;
