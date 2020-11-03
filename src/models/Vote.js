import mongoose from 'mongoose'

const { Schema } = mongoose

const VoteSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  max_votes: {
    type: Number,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  candidates: [{
    type: Schema.Types.ObjectId
  }]
}, { collection: 'votes' })

const VoteModel = mongoose.model('Vote', VoteSchema)

VoteModel.getAll = () => {
  return VoteModel.find({})
}

export default VoteModel
