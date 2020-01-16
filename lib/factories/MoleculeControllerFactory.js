// MoleculeControllerFactory

// Important
// Hydrogen only ever forms 1 bond
// Oxygen always forms 2 bonds
// Nitrogen always forms 3 bonds
// Carbon always forms 4 bonds
// In diagrams Carbon atoms are presented by corners.
// Hydrogen atoms are not shown but are implied.
// halogens have one bond and three lone pairs

const MoleculeController = require('../controllers/MoleculeController.js')
//MoleculeController.should.be.a.Function()

const MoleculeControllerFactory = (molecule) => {
    return MoleculeController(molecule)
}

module.exports = MoleculeControllerFactory

