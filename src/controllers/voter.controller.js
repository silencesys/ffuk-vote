import Voter from '../models/Voter'
import Candidate from '../models/Candidate'
import logger from '../utils/logger'

export async function isVoting (req, res, next) {
  try {
    const existingVoter = await Voter.exists({
      oidos: req.user.oidos,
      vote_attended: req.params.id
    })

    if (existingVoter) {
      return res.status(422).json({
        message: 'Voter with this ID already voted.',
        i18n_message: 'voter:already_voted',
        status: 'error'
      })
    }
    const votes = req.body.candidates
    for (let i = 0; i < votes.length; i++) {
      const oidos = votes[i]
      try {
        const candidate = await Candidate.findOne({
          oidos: oidos,
          type: req.params.id
        })

        if (!candidate) {
          logger.error(new Error(`Candidate with OIDOS: ${oidos} was not found in DB.`))
        } else {
          candidate.votes = candidate.votes + 1
          candidate.save()
        }
      } catch (error) {
        return next(error)
      }
    }

    const voter = new Voter({
      name: req.user.name,
      oidos: req.user.oidos,
      vote_attended: req.params.id
    })

    voter.save()

    return res.json({
      message: 'Voter successfuly stored!',
      i18n_message: 'voter:store_success',
      user: voter,
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}

export async function index (req, res, next) {
  try {
    const voters = await Voter.find({})

    return res.json({
      voters: voters
    })
  } catch (error) {
    next(error)
  }
}

export async function usersVotings (req, res, next) {
  try {
    const voters = await Voter.find({ oidos: req.user.oidos })
    const userVotes = voters.map((item) => {
      return item.vote_attended
    })

    return res.json({
      voted_in: userVotes
    })
  } catch (error) {
    next(error)
  }
}
