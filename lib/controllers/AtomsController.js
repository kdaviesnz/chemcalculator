const AtomsFactory = require('../factories/AtomsFactory')

const AtomsController = (atoms, SMILES, add_hydrogens) => {

    if (undefined === atoms || null === atoms || atoms.length ===0) {
        atoms = AtomsFactory(SMILES, add_hydrogens)
    }

    const has_all_carbons = () => {
        return atoms.filter(
            (atom) => atom.atomicSymbol !== "C" && atom.atomicSymbol !== "H"
        ).length === 0
    }

    const number_bonds = (bond_type) => { // type == 2 for double bond, 3 for triple bonds

        // Remove outer shell hydrogens
        const atoms_sans_hydrogens = atoms.filter(
            (atom) => atom.atomicSymbol !== "H"
        )

        // Remove outer shell electrons bonded to hydrogens
        const atoms_sans_hydrogens_and_hydrogen_bonds = atoms_sans_hydrogens.map(
            (atom) => {
                atom.outer_shell_electrons = atom.outer_shell_electrons.filter(
                    (electron) => undefined === electron.bonded_atom || electron.bonded_atom.atomicSymbol !== "H"
                )
                return atom
            }
        )

        const number_of_bonds = atoms_sans_hydrogens_and_hydrogen_bonds.reduce(
            (carry, atom) => {
                // Get the number of bonded atom ids that point to the same atom
                const n = atom.outer_shell_electrons.filter(
                    (electron) => {
                        return electron.bonded_atom !== undefined && atom.outer_shell_electrons.filter(
                            (e) => e.bonded_atom !== undefined && e.bonded_atom.bonded_atom__id === electron.bonded_atom.bonded_atom__id
                        ).length === bond_type
                    }
                ).length
                return carry + (n/2)
            },
            0
        ) / 2

        /*
C jg351uyjvaapxhz
[ { __id: 'jg351uyjvaapxi0',
    ref: 'jg351uyjvaapxj7',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxia' } } ]
C jg351uyjvaapxia
[ { __id: 'jg351uyjvaapxib',
    ref: 'jg351uyjvaapxj7',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxhz' } },
  { __id: 'jg351uyjvaapxic',
    ref: 'jg351uyjvaapxj8',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxil' } } ]
C jg351uyjvaapxil
[ { __id: 'jg351uyjvaapxim',
    ref: 'jg351uyjvaapxj8',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxia' } },
  { __id: 'jg351uyjvaapxin',
    ref: 'jg351uyjvaapxj9',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxiw' } },
  { __id: 'jg351uyjvaapxio',
    ref: 'jg351uyjvaapxj9',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxiw' } } ]
C jg351uyjvaapxiw
[ { __id: 'jg351uyjvaapxix',
    ref: 'jg351uyjvaapxj9',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxil' } },
  { __id: 'jg351uyjvaapxiy',
    ref: 'jg351uyjvaapxj9',
    bonded_atom: { atomicSymbol: 'C', bonded_atom__id: 'jg351uyjvaapxil' } } ]

         */
        return number_of_bonds;
    }

    const number_double_bonds = () => {
        return number_bonds(2)
    }

    const number_triple_bonds = () => {
        return number_bonds(3)
    }

    const number_of_halides = () => {
        return atoms.reduce(
            (carry, atom) => {
                return carry + (atom.is_halogen?1:0)
            },
            0
        )
    }

    return {
        number_double_bonds: number_double_bonds(),
        number_triple_bonds: number_triple_bonds(),
        has_all_carbons: has_all_carbons(),
        number_of_halides: number_of_halides(),
        filter_atoms_by: (callback) => {
            return atoms.filter(
                (atom) => callback(atom)
            )
        }
    }
}

module.exports = AtomsController
