const moongose = require('mongoose')

const { Schema } = require('mongoose');

const UserSchema = new Schema({
  name:String,
  email:String,
  password:String
})

const GroupSchema = new Schema({
  name:String,
  participants: [{
    name:String,
    email:String
  }]
})

const UserModel = moongose.model('user', UserSchema)
const GroupModel = moongose.model('group', GroupSchema)

module.exports = { UserModel, GroupModel }