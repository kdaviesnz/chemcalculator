const ReactionController = require('../controllers/ReactionController')

const ReactionControllerFactory = (molecule) => {
    return ReactionController(molecule)
}

module.exports = ReactionControllerFactory

