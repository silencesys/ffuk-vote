import mongoose from 'mongoose'

const { Schema } = mongoose

const VoterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  oidos: {
    type: Number,
    unique: true,
    required: true
  },
  vote_attended: [{
    type: Schema.Types.ObjectId,
    ref: 'Vote'
  }]
}, { collection: 'voters' })

const VoterModel = mongoose.model('Voter', VoterSchema)

VoterModel.getAll = () => {
  return VoterModel.find({})
}

export default VoterModel
