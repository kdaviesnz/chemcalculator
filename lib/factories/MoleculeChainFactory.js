const MoleculeController = require('../controllers/MoleculeController')
const _ = require('lodash');

const MoleculeChainFactory = (molecule) => {

    // // CC(C)(C)Cl
    calcLongestChain = (atomicSymbol) => {

        const molecule_controller = MoleculeController(molecule)
        const chains = molecule_controller.extractChains( _.map(molecule.atoms, _.clone))

        // Get only chains where the last atom matches the last atom in molecule.atoms
        const matched_chains = chains.filter(
            (chain) => {
                const last_molecule_atom = molecule.atoms[molecule.atoms.length-1]
                const last_atom = chain[chain.length-1]
                return last_atom.__id === last_molecule_atom.__id
            }
        )

        const chains_filtered = atomicSymbol===undefined?matched_chains:matched_chains.filter(
            (chain) => {
                return chain.filter(
                    (atom) => atom.atomicSymbol !== atomicSymbol
                ).length ===0
            }
        )

        return longest_chain = matched_chains.reduce(
            (carry, chain) => {
                return carry.length < chain.length?chain:carry;
            },
        )

    }

    const fetchLongestChainSMILES = () => {
        const chain = calcLongestChain()
        return chain.reduce(
            (carry, atom) => {
                return carry + atom.atomicSymbol
            },
            ""
        )
    }

    const fetchTrunkIds = () => {
        const chain = calcLongestChain()
        return chain.map(
            (atom) => {
                return atom.__id
            }
        )
    }

    const SMILES = () => {
        const trunkIds = fetchTrunkIds()
        const smiles = molecule.atoms.filter(
            (atom) => atom.atomicSymbol !== 'H'
        ).reduce(
            (carry, atom) => {
                if(trunkIds.indexOf(atom.__id)===-1) {
                    // Atom is not on trunk
                    // @todo this won't work where atom is child of an atom that is not in the main trunk
                    return carry + '(' + atom.atomicSymbol + ')'
                }
                return carry + atom.atomicSymbol
            },
            ""
        )
        return smiles
    }

    return {
        longest_carbon_chain: calcLongestChain('C'),
        longest_chain: calcLongestChain(),
        trunk_SMILES: fetchLongestChainSMILES(),
        SMILES: SMILES()
    }

}

module.exports = MoleculeChainFactory