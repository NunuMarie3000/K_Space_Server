// this will eventually be a private route
// get/put users' layouts
const express = require('express')
const router = express.Router()
const layout = require('../models/layoutModel')

// create new layout, should be done when user creates account
router.post('/:user', async (req, res) => {
  const userId = req.params.user
  try {
    const newLayout = await layout.layoutModel.create({
      user: userId,
      backColor: '#fff',
      backImage: 'none',
      fontBodyColor: 'black',
      heroImg1: 'https://images.unsplash.com/photo-1663076121570-eb6e69bdde3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      heroImg1Alt: 'Photo by Renato Ramos Puma on Unsplash',
      heroImg2: 'https://images.unsplash.com/photo-1663076121570-eb6e69bdde3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
      heroImg2Alt: 'Photo by Renato Ramos Puma on Unsplash'
    })
    await newLayout.save()
    res.status(201).send('layout created')
  } catch (error) {
    res.send(error)
  }
})

router.get('/:user', async (req, res) => {
  const userId = req.params.user
  try {
    const response = await layout.layoutModel.find({ user: userId });
    res.status(200).send(response)
  } catch (error) {
    res.send(error)
  }
})

// update route for when user submits update layout form
router.put('/:user', async (req,res)=>{
  const userId = req.params.user
  const updatedBody = req.body
  try {
    await layout.layoutModel.find({ user: userId }).updateOne(updatedBody)
    res.status(200).send('layout updated')
  } catch (error) {
    res.send(error)
  }
})

module.exports = router