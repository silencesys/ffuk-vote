import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  oidos: {
    type: Number,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  }
}, { collection: 'users' })

const UserModel = mongoose.model('User', UserSchema)

UserModel.getAll = () => {
  return UserModel.find({})
}

export default UserModel
