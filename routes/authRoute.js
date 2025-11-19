const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { userModel } = require('../models/userModel')
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../services/emailService');

// Register new user
router.post('/register', async (req, res) => {
  console.log('Registering new user')
  try {
    const { username, email, password } = req.body;
    console.log({ username, email, password })
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { username }] 
    })
    console.log({ existingUser })
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
    const { email, password } = req.body;
    console.log({ email, password })
    
    const user = await userModel.findOne({ email });
    console.log({ user })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    console.log({ isMatch })
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    console.log({ token })
    res.json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase() // 6 character token
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    // Save token to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()
    console.log('done saving user');
    // Send email
    const emailSent = await sendResetEmail(email, resetToken)
    
    if (!emailSent) {
      throw new Error('Failed to send reset email')
    }

    res.json({ message: 'Reset instructions sent to your email' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body
    
    const user = await userModel.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    // Update password
    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    res.json({ message: 'Password successfully reset' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/test-email', async (req, res) => {
  try {
    await sendResetEmail(
      'storm.obryant+test@gmail.com',
      'test-token-123'
    );
    
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

module.exports = router;
