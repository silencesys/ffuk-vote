import mongoose from 'mongoose'

const VoterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  oidos: {
    type: Number,
    unique: true,
    required: true
  }
}, { collection: 'voters' })

const VoterModel = mongoose.model('Voter', VoterSchema)

VoterModel.getAll = () => {
  return VoterModel.find({})
}

export default VoterModel
