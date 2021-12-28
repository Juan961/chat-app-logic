const mongoose = require('mongoose');
const { DB_NAME } = require('../config/index.config');

const { UserModel, GroupModel } = require('../models/index')

const MongoURI = `mongodb://localhost:27017/${DB_NAME}`;

const { encript, compare } = require('./bcrypt')

class MongoLib {

  constructor() {
    this.conection()
  }
  
  async conection(){
    try {
      await mongoose.connect(MongoURI);
      console.log("Conected to database");
    } catch (error) {
      console.log("Error")
      throw error
    }
  }

  async getAllUsers(){
    let result = await UserModel.find({}).exec()

    return result
  }

  async login({email, password}){
    let result = await UserModel.findOne({ email }).exec()

    let isValid = await compare(password, result.password);

    if(isValid){
      return result
    }

    return null
  }

  async register({name, email, password}){

    let user = await UserModel.findOne({ email }).exec()

    if(user){
      throw new Error('User already exists')
    }

    let hash = await encript(password)

    let newUser = new UserModel({
      name,
      email,
      password: hash
    })

    let result = await newUser.save()

    return result
  }

  async createGroup({name_group, id_user}){
    let user = await UserModel.findById(id_user).exec()
    let newGroup = new GroupModel({
      name: name_group,
      participants: [
        {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      ]
    })

    let result = await newGroup.save()

    return result
  }

  async getUserGroups(id_user){
    let user = await UserModel.findById(id_user).exec()

    let result = await GroupModel.find({"participants._id":user._id}).exec()

    return result
  }

  async getGroup(groupId){
    let result = await GroupModel.findById(groupId).exec()

    return result
  }

  async addUserToGroup({id_group, email_user}){
    let user = await UserModel.findOne({ email: email_user }).exec()

    if (!user) {
      return null
    }

    let result = await GroupModel.findOneAndUpdate({ _id: id_group }, { $push: { participants: {
      _id: user._id,
      name: user.name,
      email: user.email
    } } }, { new: true }).exec()

    return result
  }
}

module.exports = MongoLib