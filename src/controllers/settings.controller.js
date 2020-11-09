import Settings from '../models/Settings'
import logger from '../utils/logger'

export async function get (req, res, next) {
  const key = req.body.key || req.query.key
  try {
    const option = await Settings.findOne({ key: key })

    if (!option) {
      return res.status(404).json({
        message: 'Settings for given key was not found',
        i18n_message: 'settings:key_not_found',
        status: 'error'
      })
    }

    return res.json({
      option: option.value,
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}

export async function store (req, res) {
  const keys = Object.keys(req.body)
  for (let i = 0; i < keys.length; i++) {
    try {
      let option = await Settings.findOne({ key: keys[i] })

      console.log(req.body[keys[i]])

      if (option) {
        option.value = req.body[keys[i]]
      } else {
        option = new Settings({
          key: keys[i],
          value: req.body[keys[i]]
        })
      }

      option.save()
    } catch (error) {
      logger.error(error)
    }
  }

  return res.json({
    message: 'Settings successfuly stored!',
    i18n_message: 'settings:store_success',
    status: 'success'
  })
}

export async function all (req, res, next) {
  try {
    const settings = await Settings.find({})

    const items = {}
    settings.forEach(item => {
      items[item.key] = item.value
    })

    console.log(items)

    return res.json(items)
  } catch (error) {
    next(error)
  }
}