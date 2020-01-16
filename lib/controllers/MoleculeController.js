// MoleculeController
/*
Private Methods:
findPositiveChargedAtomIndexRecursive (atoms, index)
getAtomChains (atoms)
getChainRecursive (atom, atoms, chain)
moleculesAreSame (source_molecule, molecule_to_compare)
findAtomByReference (atoms, atom, index)
_findAtomByAtomicSymbolIndex (atoms, atomic_symbol, index)
breakMolecule (atom_to_break_molecule_by)
addProtonToAtom  (atoms, proton, index)
deleteElectronBond (electron_ref, electrons, index)
getMatchingAtom = (first_child_atom, atoms, index)
findAtomWithLonePairIndex = (atoms, index)
findAtomWithMissingValenceElectronsIndex = (atoms, index)
_findFreeRadicalAtomByAtomicSymbolIndex(atoms, atomic_symbol, index)

Public  Methods:
popMolecule(molecule_to_pop)
breakMolecule(atom)
addProton(proton)
proton()
push(atom)
pop(atom)
findAtomByAtomicSymbolIndex(atoms, atomic_symbol, index),
findFreeRadicalAtomByAtomicSymbolIndex(atoms, atomic_symbol, index)
breakBonds(bond_id)
halfArrowPush(target_molecule, electron, target_atom)
// create covalent bond where base_molecule donates all the electrons
acceptElectronPair(base_molecule)
*/
const ReactionFactory = require('../factories/ReactionFactory.js')
const MoleculeFactory = require('../factories/MoleculeFactory.js')
const AtomFactory = require('../factories/AtomFactory.js')
const uniqid = require('uniqid')
const _ = require('lodash');

const MoleculeController = (molecule) => {


    const findElectronsDoublePairRecursive = (atoms, atom, outer_shell_electrons, index, atom_index) => {

        if (undefined === outer_shell_electrons[index]) {
            return null
        }

        if (undefined === outer_shell_electrons[index].ref) {
            return findElectronsDoublePairRecursive(atoms, atom, outer_shell_electrons, index + 1, atom_index)
        }


        const matching_outer_shell_electrons = outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.ref
                    && electron.__id !== outer_shell_electrons[index].__id
                    && electron.bonded_atom.bonded_atom__id === outer_shell_electrons[index].bonded_atom.bonded_atom__id
            }
        )

        if (matching_outer_shell_electrons.length === 1) {
            return [atom, findAtomByAtomicId(atoms, outer_shell_electrons[index].bonded_atom.bonded_atom__id, 0)]
        }

        return findElectronsDoublePairRecursive(atoms, atom, outer_shell_electrons, index + 1, atom_index)

    }

    const findPositiveChargedAtomIndexRecursive = (atoms, index) => {
        if (undefined === atoms[index]) {
            return null
        }

        if (atoms[index].protons.length > atoms[index].atomic_number) {
            return index
        }

        return findPositiveChargedAtomIndexRecursive(atoms, index + 1)

    }

    const getAtomChains = (atoms) => {
        // [ 'O', 'H' ]
        const atoms_no_hydrogens = atoms.filter((atom) => atom.atomicSymbol !== "H")
        return atoms_no_hydrogens.map(
            (atom) => {
                const chain = getChainRecursive(atom, atoms_no_hydrogens, atom.atomicSymbol)
                return chain
            }
        )
    }


    const getChainRecursive = (atom, atoms, chain) => {
        // Find atom in atoms with atom.ref
        const ref_atom = findAtomByReference(atoms, atom, 0);
        if (ref_atom === null || ref_atom === atom) {
            return chain
        }
        chain = chain + ref_atom.atomicSymbol
        return getChainRecursive(ref_atom, atoms, chain)
    }

    const moleculesAreSame = (source_molecule, molecule_to_compare) => {

        // Check number of atoms
        if (source_molecule.atoms.length !== molecule_to_compare.atoms.length) {
            return false
        }

        // Check atoms
        const molecule_symbols_only = source_molecule.atoms.map(
            (atom) => atom.atomicSymbol
        ).sort()

        const molecule_to_compare_symbols_only = molecule_to_compare.atoms.map(
            (atom) => atom.atomicSymbol
        ).sort()

        const isEqual = require('lodash.isequal')
        if (!isEqual(molecule_symbols_only, molecule_to_compare_symbols_only)) {
            return false
        }

        // @todo check number of hydrogens are the same

        // Check bonds
        // For each atom create a chain by refs.
        // A chain ends when there are no more ref or ref is to first atom
        const molecule_atom_chains = getAtomChains(source_molecule.atoms.filter(
            (atom) => atom.atomicSymbol !== "H"
        )).sort()

        const molecule_to_compare_atom_chains = getAtomChains(molecule_to_compare.atoms.filter(
            (atom) => atom.atomicSymbol !== "H"
        )).sort()


        if (!isEqual(molecule_atom_chains, molecule_to_compare_atom_chains)) {
            return false
        }
        return true

    }


    const findAtomByReference = (atoms, atom, index) => {
        // Now we check if the current atom (atom) is bonded to any of the atoms
        // in the accumulator (atoms).
        // We do this by checking if any of the outer electrons of the current atom has a
        // reference property that matches any of the reference properties of
        // any of the electrons of any of the atoms in the accumulator.
        // Structure of an electron: {__id: "XYZ", ref: "ABC"}
        // An atom has an outer_shell_electrons array property
        if (undefined === atom) {
            return null
        }

        if (atom.outer_shell_electrons.length === 0 || undefined === atoms[index] || atoms[index].outer_shell_electrons.length === 0) {
            return null
        }

        // Ignore hydrogens
        if (atoms[index].atomicSymbol === "H") {
            return findAtomByReference(atoms, atom, index + 1)
        }

        // Filter out electrons that don't have a matching reference
        const target_atom_electrons_filtered = atoms[index].outer_shell_electrons.filter(
            (current_electron) => {
                if (undefined === current_electron.ref) {
                    return false
                }
                const target_ref = current_electron.ref
                const source_electrons_filtered = atom.outer_shell_electrons.filter(
                    (current_source_electron) => {
                        if (undefined === current_source_electron.ref) {
                            return false
                        }
                        return current_source_electron.__id !== current_electron.__id && current_source_electron.ref === target_ref
                    }
                )
                return source_electrons_filtered.length > 0
            }
        )

        if (target_atom_electrons_filtered.length > 0) {
            atoms[index].index = index
            return atoms[index]
        }
        return findAtomByReference(atoms, atom, index + 1)

    }

    const extractChains = (atoms) => {

        // Traverse through the atoms and when we get to the end of a branch
        // save the traversal then remove from molecule the atom matching the last atom traversed
        // so we don't repeat the same traversal twice
        const const_non_hydrogen_atoms = atoms.filter(
            (atom) => atom.atomicSymbol !== "H"
        )

        let chains = []

        const_non_hydrogen_atoms.map(
            (atom, offset, arr) => {

                let non_hydrogen_atoms = arr

                let i = 0 + offset
                let chain = []
                do {

                    // Push atom onto the current chain.
                    if (non_hydrogen_atoms[i] === undefined) {
                        console.log("MoleculeController.js")
                        process.exit()
                    }
                    chain.push(non_hydrogen_atoms[i].__id)

                    // Get ids of atoms bonded to current atom, excuding hydrogens and parent of current atom.
                    const next_atom_ids = non_hydrogen_atoms[i].outer_shell_electrons.filter(
                        (electron) => {
                            return undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol !== "H" && chain.indexOf(electron.bonded_atom.bonded_atom__id) === -1
                        }
                    ).map(
                        (electron) => {
                            return electron.bonded_atom.bonded_atom__id
                        }
                    )


                    // If there are no next atom ids then we are at the end of a chain.
                    // Push chain to chains and reset chain
                    // and remove the current atom from non_hydrogen_atoms so that
                    // we don't repeat the chain again.
                    if (next_atom_ids.length === 0) {
                        chains.push(chain)
                        chain = []
                        // Remove any reference to the atom as a bonded atom
                        non_hydrogen_atoms = non_hydrogen_atoms.map(
                            (atom, atom_index) => {
                                atom.outer_shell_electrons = atom.outer_shell_electrons.filter(
                                    (electron) => {
                                        return undefined === electron.bonded_atom || electron.bonded_atom.atomicSymbol === "H" || electron.bonded_atom.bonded_atom__id !== non_hydrogen_atoms[i].__id
                                    }
                                )
                                return atom
                            }
                        )
                        // Remove the atom from non_hydrogen_atoms
                        non_hydrogen_atoms.splice(i, 1);
                        i = 0
                    } else {
                        i++
                    }


                } while (non_hydrogen_atoms.length > 1);


            }
        )

        const chains_uniq = _.uniqWith(chains, _.isEqual)

//        console.log(molecule.atoms[0].outer_shell_electrons)
        //      process.exit()

        // Convert ids to atoms
        return chains_uniq.map(
            (chain) => {
                chain_atoms = chain.map(
                    (atom_id) => {
                        return findAtomByAtomicId(_.map(molecule.atoms, _.clone), atom_id, 0)
                    }
                )
                return chain_atoms
            }
        )

    }


    const findAtomByAtomicId = (atoms, atomic_id, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        if (atoms[index].__id === atomic_id) {
            return atoms[index]
        }

        return findAtomByAtomicId(atoms, atomic_id, index + 1)

    }

    const findAtomByAtomicIdIndex = (atoms, atomic_id, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        if (atoms[index].__id === atomic_id) {
            return index
        }

        return findAtomByAtomicIdIndex(atoms, atomic_id, index + 1)

    }


    const findAtomWithLonePairIndex = (atoms, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        const lone_electrons = atoms[index].electrons.filter(
            (electron) => undefined === electron.ref
        )

        if (lone_electrons.length > 1) {
            return index
        }

        return findAtomWithLonePairIndex(atoms, index + 1)

    }

    const findAtomWithMissingValenceElectronsIndex = (atoms, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        if (8 - atoms[index].outer_shell_electrons.length > 1) {
            return index
        }

        return findAtomWithMissingValenceElectronsIndex(atoms, index + 1)
    }

    const breakMolecule = (atom_to_break_molecule_by) => {
// A molecule consists of a one dimensional array of atoms.
// An atom is connected to other atoms by its electrons array property.
// Two atoms are connected if they have electrons matching on the electron.ref property.
// 1. Get atom by atom_id
// 2. Remove the bond pointing to the parent atom.
// Create two arrays. The first array (main_atoms) is to hold the atoms not connected to the atom we’ve split the molecule by.
// The second array (branch_atoms) is to hold the atoms that are connected to the atom we’ve split the molecule by:
//  - get atom
//  - does atom have a reference to any of the atoms in branch_atoms?
//  - N - add to main_atoms
// - get next atom

        const main_atoms = []

        const molecule_atoms = molecule.atoms

        // Break bond to parent atom
        // We need to get the atom in molecule.atoms that matches atom_to_break_molecule_by
        const molecule_atom_to_break_molecule_by = molecule.atoms.filter(
            (atom) => {
                return atom.atomicSymbol === atom_to_break_molecule_by.atomicSymbol
            }
        ).pop()
        const parent_atom = findAtomByReference(_.map(molecule.atoms, _.clone), molecule_atom_to_break_molecule_by, 0)
        molecule_atoms[parent_atom.index].outer_shell_electrons.map(
            (electron) => {
                // Check for bonded electron in atom_to_break_molecule_by
                const atom_to_break_molecule_by_electrons_filtered = molecule_atom_to_break_molecule_by.outer_shell_electrons.filter(
                    (atom_to_break_molecule_by_electron) => {
                        if (electron.ref === atom_to_break_molecule_by_electron.ref) {
                            return true
                        }
                        return false
                    }
                )
                if (atom_to_break_molecule_by_electrons_filtered.length > 0) {
                    delete (electron.ref)
                }
                return electron
            }
        )

        const branch_atoms = molecule_atoms.reduce((accumulator, current_atom, index) => {

            if (current_atom.atomicSymbol === molecule_atom_to_break_molecule_by.atomicSymbol) {
                accumulator.push(current_atom)
            } else {

                // Now we check if the current atom is bonded to any of the atoms
                // in the accumulator.
                // We do this by checking if any of the electrons of the current atom has a
                // reference property that matches any of the reference properties of
                // any of the electrons of any of the atoms in the accumulator.
                const atom_by_reference = findAtomByReference(accumulator, current_atom, 0)
                if (atom_by_reference !== null) {
                    accumulator.push(current_atom)
                } else {
                    main_atoms.push(current_atom)
                }
            }
            return accumulator
        }, [])
        return [MoleculeFactory([], main_atoms), MoleculeFactory([], branch_atoms)]
    }

    const removeProtonFromAtom = (atoms, proton, index) => {
        if (undefined === atoms[index]) {
            return atoms
        }

        const start_number_of_protons = atoms[index].protons.length

        const protons = atoms[index].protons
        protons.pop()

        // if atom that we just removed the proton from is Hydrogen (proton count = 0)
        // then we need to remove the atom from the molecule as it is now an electron
        if (atoms[index].atomicSymbol === "H") {
            const hydrogen_atom_id = atoms[index].__id
            const hydrogen_atom_outer_shell_electron_id = atoms[index].outer_shell_electrons[0].__id
            const bonded_atom_id = atoms[index].outer_shell_electrons[0].bonded_atom.bonded_atom__id
            atoms.splice(index, 1);
            const bonded_atom_index = findAtomByAtomicIdIndex(atoms, bonded_atom_id, 0)
            atoms[bonded_atom_index].outer_shell_electrons = atoms[bonded_atom_index].outer_shell_electrons.map(
                (outer_shell_electron) => {
                    if (undefined !== outer_shell_electron.bonded_atom && outer_shell_electron.bonded_atom.bonded_atom__id === hydrogen_atom_id) {
                        return {
                            "__id": outer_shell_electron.__id
                        }
                    }
                    return outer_shell_electron
                }
            )
            // Add the hydrogen electon
            atoms[bonded_atom_index].outer_shell_electrons.push(
                {
                    "__id": hydrogen_atom_outer_shell_electron_id
                }
            )
            atoms[bonded_atom_index] = AtomFactory(atoms[bonded_atom_index].atomicSymbol, atoms[bonded_atom_index].outer_shell_electrons, atoms[bonded_atom_index].protons, atoms[bonded_atom_index].__id)
            atoms[bonded_atom_index].is_anion.should.be.equal(true)
        } else {
            atoms[index] = AtomFactory(atoms[index].atomicSymbol, atoms[index].outer_shell_electrons, protons, atoms[index].__id)
            atoms[index].protons.length.should.equal(start_number_of_protons - 1)
        }

        return atoms

    }

    const addProtonToAtom = (atoms, proton, index) => {

        if (undefined === atoms[index]) {
            return atoms
        }

        if (atoms[index].atomicSymbol !== "H") {
            const protons = atoms[index].protons
            protons.push(proton)
            if (atoms[index].atomicSymbol==="C") {
                atoms[index].outer_shell_electrons.length.should.be.equal(4)
            }
            atoms[index] = AtomFactory(atoms[index].atomicSymbol, atoms[index].outer_shell_electrons, protons, atoms[index].__id)
            return atoms
        }

        return addProtonToAtom(atoms, proton, index + 1)
    }

    const deleteElectronBond = (electron_ref, electrons, index) => {

        if (undefined === electrons[index]) {
            return electrons
        }

        if (undefined !== electrons[index] && undefined !== electrons[index].ref && electrons[index].ref === electron_ref) {
            delete electrons[index].ref
            delete electrons[index].bonded_atom
            return electrons
        }

        return deleteElectronBond(electron_ref, electrons, index + 1)

    }

    const getMatchingAtom = (first_child_atom, atoms, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        const atom_to_check = atoms[index]


    }

    const _findAtomByAtomicSymbolIndex = (atoms, atomic_symbol, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        if (atoms[index].atomicSymbol === atomic_symbol) {
            return index
        }

        return _findAtomByAtomicSymbolIndex(atoms, atomic_symbol, index + 1)
    }

    const _findFreeRadicalAtomByAtomicSymbolIndex = (atoms, atomic_symbol, index) => {

        if (undefined === atoms[index]) {
            return null
        }

        if (atoms[index].atomicSymbol === atomic_symbol) {
            return index
        }

        return _findFreeRadicalAtomByAtomicSymbolIndex(atoms, index + 1)
    }

    return {

        popMolecule: (molecule_to_pop) => {
            const process = () => () => {
                // Break molecule by first atom
                // Second molecule returned should match atoms
                const molecules = breakMolecule(molecule_to_pop.atoms[0])
                if (undefined === molecules[1] || !moleculesAreSame(molecule_to_pop, molecules[1])) {
                    return [molecule]
                } else {
                    return molecules
                }
            }
            return ReactionFactory(molecule, "reaction", process())
        },

        breakMolecule: (atom) => {
            const process = () => () => {
                return breakMolecule(_.map(molecule.atoms, _.clone))
            }
            return ReactionFactory(molecule, "reaction", process())
        },

        removeProton: (proton) => {
            const react = () => () => {
                proton.should.be.ok()
                const proton_atom_index = findAtomByAtomicIdIndex(_.map(molecule.atoms, _.clone), proton.atom_id, 0)
                const atoms = removeProtonFromAtom(_.map(molecule.atoms, _.clone), proton, proton_atom_index)
                return [MoleculeFactory(molecule, atoms)]
            }
            return ReactionFactory(molecule, "reaction", react())
        },

        addProton: (proton, atom) => {
            const react = () => () => {
                const target_atom_index = findAtomByAtomicIdIndex(_.map(molecule.atoms, _.clone), atom.__id, 0)

                if (target_atom_index === null) {
                    new Error("Attempted to add proton to a null atom")
                }

                // Verify carbon atoms
                molecule.atoms.map(
                    (atom, i) => {
                        if (atom.atomicSymbol==='C') {
                            atom.outer_shell_electrons.length.should.be.equal(4)
                        }
                    }
                )

                // Add to target atom
                const atoms = addProtonToAtom(_.map(molecule.atoms, _.clone), proton, target_atom_index)
                return [MoleculeFactory(molecule, atoms)]
            }
            return ReactionFactory(molecule, "reaction", react())
        },

        proton: () => {
            const process = () => () => {

                // ignoring hydrogens look for atom where the number of protons exceeds the atom’s atomic number.
                const positive_charged_atom_index = findPositiveChargedAtomIndexRecursive(_.map(molecule.atoms, _.clone).filter((atom) => atom.atomicSymbol !== "H"), 0)
                if (null !== positive_charged_atom_index) {
                    const atoms = molecule.atoms
                    const proton = atoms[positive_charged_atom_index].protons.pop()
                    return [MoleculeFactory(molecule, atoms), proton]
                } else {
                    return [molecule]
                }
            }
            return ReactionFactory(molecule, "reaction", process())
        },

        push: (atom) => {
            const process = () => () => {
                molecule.atoms.push(atom)
                return [molecule]
            }
            return ReactionFactory(molecule, "reaction", process(molecule))
        },

        pop: (atom) => {
            const process = () => () => {
                // this should change molecule
                const atom_from_molecule = molecule.atoms.pop(atom,)
                return [molecule, atom_from_molecule]
            }
            return reactionFactory(molecule, "reaction", process())
        },

        findAtomByAtomicSymbolIndex: (atoms, atomic_symbol, index) => {
            return _findAtomByAtomicSymbolIndex(atoms, atomic_symbol, index)
        },

        findFreeRadicalAtomByAtomicSymbolIndex: (atoms, atomic_symbol, index) => {
            return _findFreeRadicalAtomByAtomicSymbolIndex(atoms, atomic_symbol, index)
        },

        acceptElectronPair: (base_molecule) => {
            const process = () => () => {
// create covalent bond where base_molecule donates all the electrons

                const base_molecule_atoms = base_molecule.atoms

                const lone_pair_atom_index = findAtomWithLonePairIndex(base_molecule_atoms, 0)

                const refs = [uniqid(), uniqid()]

// add electrons to molecule atom
                const molecule_atoms = molecule.atoms
                const atom_with_missing_valence_electrons_index = findAtomWithMissingValenceElectronsIndex(molecule_atoms, 0)
                const new_electrons = molecule_atoms[atom_with_missing_valence_electrons_index].electrons

                new_electrons.push({__id: uniqid(), ref: refs[0]})

                new_electrons.push({__id: uniqid(), ref: refs[1]})

                molecule_atoms[atom_with_missing_valence_electrons_index] = AtomFactory(molecule_atoms[atom_with_missing_valence_electrons_index].atomicSymbol, new_electrons, molecule_atoms[atom_with_missing_valence_electrons_index].protons, molecule_atoms[atom_with_missing_valence_electrons_index].__id)

// add ref props to electrons from lone_pair_atom that do not have ref property

                base_molecule_atoms[lone_pair_atom_index] = AtomFactory(base_molecule_atoms[lone_pair_atom_index].atomicSymbol, base_molecule_atoms[lone_pair_atom_index].electrons.map((electron) => {
                    if (undefined === electron.ref && refs.length > 0) {
                        electron.ref = refs.pop()
                    }
                    return electron
                }, base_molecule_atoms[lone_pair_atom_index].__id), base_molecule_atoms[lone_pair_atom_index].protons)

                return MoleculeFactory(null, [...molecule_atoms, ...base_molecule_atoms])
            }
            return ReactionFactory(molecule, "reaction", process())
        },


        breakBonds: (bond_id) => {
            const react = () => (molecule) => {
                /*Break bond
                Once we’ve broken the bond we need to check if we now have seperate molecules
                */
                const products = []
                return [products]
            }
            return ReactionFactory(molecule, "reaction", react())
        },

        bondAtoms: (molecule, molecule_cation_atom, molecule_anion_atom) => {
            const react = () => () => {

                molecule.should.be.a.Object()
                molecule_cation_atom.should.be.a.Object()
                molecule_anion_atom.should.be.a.Object()

                console.log("@todo MoleculeController.js Add bond function")

                molecule_cation_atom.outer_shell_electrons[0].ref = molecule_anion_atom.outer_shell_electrons[0].__id
                molecule_anion_atom.outer_shell_electrons[0].ref = molecule_cation_atom.outer_shell_electrons[0].__id

                const atoms = molecule.atoms


                const product = MoleculeFactory({}, atoms, false, null)


                return [product]
            }
            return ReactionFactory(molecule, "reaction", react())
        },

        addMolecule: (molecule, molecule_atom, target_molecule, target_atom) => {

            const react = () => () => {

                molecule.should.be.a.Object()
                molecule_atom.should.be.a.Object()
                target_atom.should.be.a.Object()

                molecule_atom.should.have.property('outer_shell_electrons')
                target_atom.should.have.property('outer_shell_electrons')

                const molecule_controller = MoleculeController(molecule)

                const molecule_atom_index = molecule_controller.findAtomByAtomicIdIndex(_.map(molecule.atoms, _.clone), molecule_atom.__id, 0)
                const target_atom_index = findAtomByAtomicIdIndex(target_molecule.atoms, target_atom.__id, 0)
                target_atom_index.should.be.not.equal(null)
                molecule_atom_index.should.be.not.equal(null)

                // @todo work out how to determine what electrons to use
                molecule_atom.outer_shell_electrons[0].ref = target_atom.outer_shell_electrons[0].__id
                target_atom.outer_shell_electrons[0].ref = molecule_atom.outer_shell_electrons[0].__id

                // IMPORTANT cations and anions form ionic bonds
                if (molecule_atom.is_cation && target_atom.is_anion) {
                    // Cation has more protons than electrons
                    molecule_atom.outer_shell_electrons[0].bond_type = "greedy-ionic"
                    target_atom.outer_shell_electrons[0].bond_type = "generous-ionic"
                } else if (molecule_atom.is_anion && target_atom.is_cation) {
                    molecule_atom.outer_shell_electrons[0].bond_type = "generous-ionic"
                    target_atom.outer_shell_electrons[0].bond_type = "greedy-ionic"
                } else {
                    return [molecule, target_molecule]
                }

                molecule_atom.outer_shell_electrons[0].bonded_atom = {
                    bonded_atom__id: target_atom.__id,
                    atomicSymbol: target_atom.atomicSymbol
                }

                target_molecule.atoms[target_atom_index] = AtomFactory(target_atom.atomicSymbol, target_atom.outer_shell_electrons, target_atom.protons, target_atom.__id)
                molecule.atoms[molecule_atom_index] = AtomFactory(molecule_atom.atomicSymbol, molecule_atom.outer_shell_electrons, molecule_atom.protons, molecule_atom.__id)

                // Neither molecule atom or target atom should be a cation or an anion
                if (molecule.atoms[molecule_atom_index].is_cation) {
                    console.log("MoleculeController::addMolecule()")
                    console.log(molecule.atoms[molecule_atom_index])
                    process.exit()
                }

                molecule.atoms[molecule_atom_index].is_cation.should.be.equal(false)
                molecule.atoms[molecule_atom_index].is_anion.should.be.equal(false)
                target_molecule.atoms[target_atom_index].is_cation.should.be.equal(false)
                target_molecule.atoms[target_atom_index].is_anion.should.be.equal(false)

                const atoms = [...molecule.atoms, ...target_molecule.atoms]

                const product = MoleculeFactory({}, atoms, false, null)

                return [product]
            }
            return ReactionFactory(molecule, "reaction", react())
        },

        addBond: function (electrons, bond_atom, ref, index) {

            // @todo Change to return a reaction
            // @todo Check to see if there are too many bonds ref SN2.js
            if (undefined === electrons[index]) {
                return null
            }

            if (undefined !== electrons[index].ref) {
                return this.addBond(electrons, bond_atom, ref, index + 1)
            }

            electrons[index].ref = ref
            electrons[index].bonded_atom = {
                atomicSymbol: bond_atom.atomicSymbol,
                bonded_atom__id: bond_atom.__id
            }

            return electrons

        },

        findAtomIndexWithDoubleBondsRecursive: function (atoms, atom_symbol, index) {

            if (undefined === atoms[index]) {
                return null
            }

            if (null !== atom_symbol && atom_symbol !== atoms[index].atomicSymbol) {
                return this.findAtomIndexWithDoubleBondsRecursive(atoms, atom_symbol, index + 1)
            }

            const double_bonds_electrons = atoms[index].outer_shell_electrons.filter(
                (electron) => {
                    if (undefined !== electron.ref) {
                        // check for electrons on the atom with the same bonded atom id
                        return atoms[index].outer_shell_electrons.filter(
                            (elect) => {
                                return undefined !== elect.ref && elect.__id !== electron.__id && elect.bonded_atom.bonded_atom__id === electron.bonded_atom.bonded_atom__id
                            }
                        ).length === 1
                    }
                    return false
                }
            )

            if (double_bonds_electrons.length === 2) {
                return index
            }

            return this.findAtomIndexWithDoubleBondsRecursive(atoms, atom_symbol, index + 1)

        },

        findDoubleBondPair: function (atoms, atom_symbol, bonded_atom_symbol, index) {

            if (undefined === atoms[index]) {
                return null
            }

            if (null !== atom_symbol && atom_symbol !== atoms[index].atomicSymbol) {
                return this.findDoubleBondPair(atoms, atom_symbol, bonded_atom_symbol, index + 1)
            }

            // Search electrons for electron that is part of a double pair
            const pair = findElectronsDoublePairRecursive(atoms, atoms[index], atoms[index].outer_shell_electrons, 0, index)
            if (null !== pair) {
                return pair
            }

            return this.findDoubleBondPair(atoms, atom_symbol, bonded_atom_symbol, index + 1)

        },

        findCationAtom: function (atoms, index) {
            if (undefined === atoms[index]) {
                return null
            }

            if (atoms[index].is_cation) {
                return atoms[index]
            }

            return this.findCationAtom(atoms, index + 1)
        },

        findAnionAtom: function (atoms, index) {
            if (undefined === atoms[index]) {
                return null
            }

            if (atoms[index].is_anion) {
                return atoms[index]
            }

            return this.findAnionAtom(atoms, index + 1)
        },

        findCationIndexRecursive: function (atoms, atom_symbol, index) {

            if (undefined === atoms[index]) {
                return null
            }

            if (null !== atom_symbol && atom_symbol !== atoms[index].atomicSymbol) {
                return this.findCationIndexRecursive(atoms, atom_symbol, index + 1)
            }

            if (atoms[index].is_cation) {
                return index
            }

            return this.findCationIndexRecursive(atoms, atom_symbol, index + 1)

        },


        halfArrowPush: (target_molecule, electron, target_atom) => {
            //  a half headed arrow is used to show the movement of one electron
            const process = () => (target_molecule, molecule, electron, target_atom) => {
                /*
                 1. Get the source electron from molecule that has __id property of electron. This should change molecule.
                 2. Remove any electrons from molecule that have same reference as the source electron.
                 3. Add the source electron to the target atom of the target molecule. This should change the target molecule.
                To do: Handle hydrogen atoms.

    If target atom is null then we must determine the target atom by finding the atom that has an orphaned electron.
    Also check if a bond is formed

                */
                const products = []
                return [products]
            }
            return ReactionFactory(molecule, "reaction", process())
        },

        findAtomByAtomicIdIndex: (atoms, atomic_id, index) => {
            return findAtomByAtomicIdIndex(atoms, atomic_id, index)
        },

        findAtomByAtomicId: (atoms, atomic_id, index) => {
            return findAtomByAtomicId(atoms, atomic_id, index)
        },

        extractChains: (atoms) => {
            return extractChains(atoms)
        }
    }
}


module.exports = MoleculeController
