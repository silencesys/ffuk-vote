import mongoose from 'mongoose'

const SettingsSchema = mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: true
  }
}, { collection: 'settings' })

const SettingsModel = mongoose.model('Settings', SettingsSchema)

export default SettingsModel
