require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// CORS configuration - supports both development and production
const getAllowedOrigins = () => {
  const origins = [];
  
  // Always include localhost for development
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000', 'http://localhost:3002');
  }
  
  // Add FRONTEND_URL if provided (supports comma-separated multiple URLs)
  if (process.env.FRONTEND_URL) {
    const frontendUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim()).filter(Boolean);
    origins.push(...frontendUrls);
  }
  
  // Filter out any undefined/null values
  return origins.filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

// Log allowed origins in production for debugging (remove sensitive info if needed)
if (process.env.NODE_ENV === 'production') {
  console.log('CORS allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'NONE SET - CORS will fail!');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // If no origins are configured in production, log warning but allow (for debugging)
    if (allowedOrigins.length === 0) {
      console.warn('CORS: No allowed origins configured. Allowing request from:', origin);
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS: Blocked request from origin:', origin);
      console.warn('CORS: Allowed origins are:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.json())

// const seed = require('./funcs/seedDB')

// const home = require('./routes/home')
const users = require('./routes/usersRoute')
const user = require('./routes/userRoute')
const entry = require('./routes/entryRoute')
const layout = require('./routes/layoutRoute')
const aboutMe = require('./routes/aboutMeRoute')
const profile = require('./routes/profileRoute')
const auth = require('./routes/authRoute')

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log('db connected')
    
    // seed.seedUser()
    // seed.seedUserInfo()
    // seed.seedEntry()
    // app.use(home)
    app.use('/users', users)
    app.use(user)
    app.use(entry)
    app.use('/layout', layout)
    app.use('/aboutme', aboutMe)
    app.use('/profile', profile)
    app.use('/auth', auth)

    app.get('/test', (req, res) => {
      console.log('Test route hit')
      res.json({ message: 'Server is running' })
    })

    const PORT = process.env.PORT || 3002
    app.listen(PORT, ()=>{
      console.log(`listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

startServer()