const _ = require('lodash');
const arraySort = require('array-sort');

const MoleculeController = require("./controllers/MoleculeController")
const MoleculeChainFactory = require("./factories/MoleculeChainFactory")

const Nomenclature = (molecule) => {


    const findIndexOfFirstSubstituentRecursive = (chain, index) => {

        // No substituents so return null.
        if (index > chain.length -1) {
            return null
        }

        // If chain[index] atom has more than one non-hydrogen bonded to it then it is a substituent and we should return its index.
        chain[index].should.be.an.Object()
        chain[index].should.have.property("outer_shell_electrons")
        chain[index].atomicSymbol.should.be.equal("C")

        if  (chain[index].outer_shell_electrons.filter(
            (electron) => {
                if (index > 0 && electron.bonded_atom.bonded_atom__id === chain[index-1].__id) {
                    return false
                }
                return undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol !== "H"
            }
        ).length > 1) {
            return index
        } else {
            return findIndexOfFirstSubstituentRecursive(chain, index+1)
        }

    }

    const numberChain = (chain, from_left) => {
        return chain.map(
            (atom, i) => {
                atom.number = from_left?i+1:chain.length-i
                return atom
            }
        )
    }

    const __atomIsSubstituent = (atom) => {
        return atom.outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol !== "H"
            }
        ).length > 2
    }

    const substituent_name_map = [
        'methyl', 'ethyl', 'propyl', 'butyl', 'pentyl', 'hexyl', 'octyl', 'nonanyl', 'decanyl', 'undecanyl', 'dodecanyl'
    ]

    const trunk_name_map = [
        'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'oct', 'nonan', 'decan', 'undecan', 'dodecan'
    ]

    const substCountMap = (named_and_numbered_chain) => {

        return {
            'methyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'methyl'
            ).length,
            'ethyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'ethyl'
            ).length,
            'propyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'propyl'
            ).length,
            'butyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'butyl'
            ).length,
            'pentyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'pentyl'
            ).length,
            'hexyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'hexyl'
            ).length,
            'octyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'octyl'
            ).length,
            'nonanyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'nonanyl'
            ).length,
            'undecanyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'undecanyl'
            ).length,
            'dodecanyl': named_and_numbered_chain.filter(
                (atom) => atom.substituent_name === 'dodecanyl'
            ).length
        }

    }

    const substPrefixesMap = (named_and_numbered_chain) => {

        const map = substCountMap(named_and_numbered_chain)

        return {
            'methyl':prefixes_for_identical_groups_map[map['methyl']-1],
            'ethyl': prefixes_for_identical_groups_map[map['ethyl']-1],
            'propyl': prefixes_for_identical_groups_map[map['propyl']-1],
            'butyl': prefixes_for_identical_groups_map[map['butyl']-1],
            'pentyl': prefixes_for_identical_groups_map[map['pentyl']-1],
            'hexyl': prefixes_for_identical_groups_map[map['hexyl']-1],
            'octyl': prefixes_for_identical_groups_map[map['octyl']-1],
            'nonanyl': prefixes_for_identical_groups_map[map['nonanyl']-1],
            'undecanyl': prefixes_for_identical_groups_map[map['undecanyl']-1],
            'dodecanyl': prefixes_for_identical_groups_map[map['dodecanyl']-1]
        }

    }

    const nameSubsituents = (numbered_chain) => {

        const molecule_controller = MoleculeController(molecule)
        const all_atoms =  _.map(molecule.atoms, _.clone)

        const numbered_chain_ids = numbered_chain.map(
            (a) => a.__id
        )


        return numbered_chain.map(
            (atom, i) => {
                atom.should.have.property('number')
                if (__atomIsSubstituent(atom)) {

                    const temp =  atom.outer_shell_electrons.filter(
                        (electron) => {
                            return undefined !== electron.bonded_atom
                                && electron.bonded_atom.atomicSymbol !=="H"
                                && numbered_chain_ids.indexOf(electron.bonded_atom.bonded_atom__id) ===-1
                        }
                    )

                    if (temp.length===0) {
                        molecule.atoms.filter(
                            (atom) => atom.atomicSymbol !== "H"
                        ).map(
                            (atom) => {
                                console.log(atom.atomicSymbol)
                                console.log(atom.outer_shell_electrons)
                            }
                        )
                        console.log(numbered_chain_ids)
                        console.log(atom.atomicSymbol)
                        console.log(atom.outer_shell_electrons)
                    }

                    // Get the bonded atom that is not in the parent chain
                    const bonded_atom_id = atom.outer_shell_electrons.filter(
                        (electron) => {
                            return undefined !== electron.bonded_atom
                                && electron.bonded_atom.atomicSymbol !=="H"
                                && numbered_chain_ids.indexOf(electron.bonded_atom.bonded_atom__id) ===-1
                        }
                    ).pop().bonded_atom.bonded_atom__id

                    bonded_atom_id.should.be.a.String()

                    const substituent_atom = molecule_controller.findAtomByAtomicId(all_atoms, bonded_atom_id, 0)
                    substituent_atom.should.be.an.Object()


                    const number_of_bonds_to_substituent_atom = substituent_atom.outer_shell_electrons.filter(
                        (electron) => undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol !=="H" && electron.bonded_atom.bonded_atom__id !== "H"
                    ).length

                    number_of_bonds_to_substituent_atom.should.be.a.Number()

                    // @todo "Some complex substituents have common names rather than systematic ones. These simply must be memorized. The most important common substituents are the isopropyl group
                    // (a three-carbon group that looks like a snake’s tongue), the tert-butyl (or t-butyl) group and the sec-butyl group, shown in Figure 7-5."
                    atom.substituent_name =  substituent_name_map[number_of_bonds_to_substituent_atom-1]

                }
                return atom
            }
        )
    }

    const prefixes_for_identical_groups_map = [
        '', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'
    ]

    const fetchSubstituentsNamesAlphabetically = (named_and_numbered_chain) => {
        /*
        The next step is to order the substituents alphabetically in front of the parent name, using numbers to indicate the location of the substituents. Because i comes before m in the alphabet,
the isopropyl group is placed in front of the methyl group in the name of the molecule: 4-isopropyl-3-methylheptane. Note that dashes are used to separate the numbers from the substituents,
and that there is no space between the last substituent and the name of the parent chain.
         */
        atoms_with_substituents = named_and_numbered_chain.filter(
            (atom) => undefined !== atom.substituent_name
        )
        atoms_with_substituents_sorted = arraySort(
            atoms_with_substituents,
            (a,b) => {
                // Of course, there’s always a stick to throw into the spokes. One quirk involving the common names of tert-butyl and sec-butyl substituents comes when placing them in alphabetical order, as the tert and sec portions of the name are ignored. In other words, tert-butyl would be ordered as if it started with the letter b, the same as with sec-butyl. Isopropyl, however, is alphabetized normally, under the letter i. (There always has to be weird exceptions like this, doesn’t there?)
                a.substituent_name = a.substituent_name === 'tert-butyl' || a.substituent_name === 'sec-butyl'?'butyl':a.substituent_name
                b.substituent_name = b.substituent_name === 'tert-butyl' || b.substituent_name === 'sec-butyl'?'butyl':b.substituent_name
                return a.substituent_name < b.substituent_name
            }
        )

        const prefix_map = substPrefixesMap(atoms_with_substituents_sorted)

        sustituent_names_ordered = atoms_with_substituents_sorted.reduce(
            (carry, atom) => {
                // Is substituent_name already in carry?
                const prefix = prefix_map[atom.substituent_name]
                const subst_name = undefined === prefix? atom.substituent_name: prefix + atom.substituent_name
                if (carry.indexOf(subst_name) !==-1) {
                    carry = carry.replace("-" + subst_name, "," + atom.number + "-" + subst_name)
                    carry = `${atom.number}-${subst_name}-${carry}`
                } else {
                    carry = `${atom.number}-${subst_name}-${carry}`
                }
                return carry
            },
            ''
        )

        sustituent_names_ordered.should.be.a.String()

        return sustituent_names_ordered.replace(/\-+$/,'')


    }

    const determineTrunkName = (chain) => {
        if (molecule.is_alkane) {
            return trunk_name_map[chain.length-1] + 'ane'
        }
        return ''
    }

    return {

        determineName: function()  {
            const longest_chain = this.calcLongestCarbonChain()
            const substituent_index_top_to_bottom = this.findIndexOfFirstSubstituent(longest_chain)
            const substituent_index_bottom_to_top = this.findIndexOfFirstSubstituent(longest_chain.reverse())
            const longest_chain_numbered = this.numberChain(longest_chain)
            const chain_with_subst_names = this.nameSubsituents(longest_chain_numbered)
            const substs = this.fetchSubstituentsNamesAlphabetically(chain_with_subst_names)
            const trunk_name = this.determineTrunkName(longest_chain)
            return substs + trunk_name
        },

        calcLongestCarbonChain: () => {
            const molecule_chain = MoleculeChainFactory(molecule)
            return molecule_chain.longest_carbon_chain
        },

        findIndexOfFirstSubstituent: (chain) => {
            return findIndexOfFirstSubstituentRecursive(chain, 0)
        },

        numberChain: (chain) => {
            const left_to_right_index = findIndexOfFirstSubstituentRecursive(chain, 0)
            const right_to_left_index = findIndexOfFirstSubstituentRecursive(chain.reverse(), 0)
            return numberChain(chain, left_to_right_index <= right_to_left_index)
        },

        nameSubsituents: (numbered_chain) => {
            return nameSubsituents(numbered_chain)
        },

        fetchSubstituentsNamesAlphabetically: (named_and_numbered_chain) => {
            return fetchSubstituentsNamesAlphabetically(named_and_numbered_chain)
        },

        determineTrunkName: (chain) => {
            return determineTrunkName(chain)
        },

        substCountMap: (named_and_numbered_chain) => {
            return substCountMap(named_and_numbered_chain)
        },

        substPrefixesMap: (named_and_numbered_chain) => {
            return substPrefixesMap(named_and_numbered_chain)
        }


    }


}

module.exports = Nomenclature