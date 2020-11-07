import mongoose from 'mongoose'

const SettingsSchema = mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
}, { collection: 'settings' })

const SettingsModel = mongoose.model('Settings', SettingsSchema)

export default SettingsModel
