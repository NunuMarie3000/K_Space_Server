// this is route to get individual user
// will eventually need authorization to view

const express = require('express')
const router = express.Router()
const user = require('../models/userModel')
const entry = require('../models/entryModel') 

// i fucked up, need to delete all but one in users collection
// we're good, something tells me to hold onto this route while i'm building

// router.delete('/:user', async (req,res)=>{
//   const doNotDelete = req.params.user
//   try {
//     await user.userModel.deleteMany({"_id": {$ne: doNotDelete}})
//     res.send('hopefully they all gone')
//   } catch (error) {
//     res.send(error)
//   }
// })

// i need post route to create a new user
router.post('/new', async (req,res)=>{
  try {
    const newUser = await user.userModel.create({
      username: req.body.username,
      email: req.body.email
    }) 
    await newUser.save()
    console.log(newUser)
    res.status(201).send(newUser)
  } catch (error) {
    console.log(error.message)
    res.send(error)
  }
})

// get existing user's id
router.get('/:email', async (req,res)=>{
  const memberEmail = req.params.email
  try {
    const memberUser = await user.userModel.findOne({"email": memberEmail})
    res.status(200).send(memberUser)
  } catch (error) {
    res.send(error)
  }
})

// get 1 user
router.get('/user/:user', async (req,res)=>{
  const userId = req.params.user
  try {
    const searchedUser = await user.userModel.find({"_id": {$eq: userId}}).populate("entries")
    res.status(200).send(searchedUser)
  } catch (error) {
    res.send(error)
  }
})

// user create new entry
// when a user creates a new entry, i need to update the userModel with the updated entry...
router.post('/:user/entry', async (req,res)=>{
  const userId = req.params.user
  const newPostBody = {
    title: req.body.title,
    body: req.body.body,
    date_of_entry: Date.now(),
    author: req.params.user
  }
  try {
    const newPost = await entry.entryModel.create(newPostBody)
    const author = await user.userModel.findById(userId)
    await newPost.save()
    author.entries = [...author.entries, newPost]
    await author.save()
    res.status(201).send('post created')
  } catch (error) {
    res.send(error)
  }
})


module.exports = router