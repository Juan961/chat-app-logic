const express = require('express')
const MongoLib = require('./lib/mongo.lib')
const cors = require('cors')

const Mongo = new MongoLib()

const app = express()
app.use(express.json())

app.use(cors())

app.get('/', async (req, res) => {
  let result = await Mongo.getAllUsers()

  res.status(200).json({
    status:result
  })
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body

  let result = await Mongo.login({email, password})
  res.status(200).json(
    result
  )
})

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body

  try {
    let result = await Mongo.register({name, email, password})
    res.status(200).json(
      result
    )  
  } catch (error) {
    if(error.message === 'User already exists'){
      res.status(400).json({
        error: error.message
      })
    } else {
      res.status(500).json({
        error: error.message
      })
    }
    
  }
  
})

// Grupos de un usuario
app.get('/groups/user/:id', async (req, res) => {
  const {id} = req.params

  let result = await Mongo.getUserGroups(id)

  res.status(200).json(
    result
  )
})

app.get('/groups/:id', async (req, res) => {
  const { id } = req.params
  let result = await Mongo.getGroup(id)

  res.status(200).json(
    result
  )
})

app.post('/groups', async (req, res) => {
  const {name, id_user} = req.body
  let result = await Mongo.createGroup({name_group:name, id_user})

  res.status(200).json(
    result
  )
})

app.post('/groups/:id_group/users', async (req, res) => {
  const {id_group} = req.params
  const {email_user} = req.body

  let result = await Mongo.addUserToGroup({id_group, email_user})

  if ( result ) {
    res.status(200).json(
      result
    )
  } else if ( result === null ) {
    res.status(200).json({
      error: "user not found"
    })
  }

})

app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000")
})