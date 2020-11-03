import mongoose from 'mongoose'

const { Schema } = mongoose

const CandidateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String
  },
  oidos: {
    type: Number,
    unique: true,
    required: true
  },
  votes: {
    type: Number
  },
  web_url: {
    type: String
  },
  type: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { collection: 'candidates' })

const CandidateModel = mongoose.model('Candidate', CandidateSchema)

CandidateModel.getAll = () => {
  return CandidateModel.find({})
}

export default CandidateModel
