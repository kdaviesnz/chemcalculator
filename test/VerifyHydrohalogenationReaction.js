const MoleculeController = require("../lib/controllers/MoleculeController")
const MoleculeChainFactory = require("../lib/factories/MoleculeChainFactory")

const VerifyHydrohalenationReaction = (reaction) => {

    // reaction.products
    // Should have only one product
    // Product should have no cations
    // Product should have no anions
    // Product should have 13  atoms
    // Product should have no double bonds
    // Chlorine atom should be bonded to third carbon
    reaction.products.length.should.be.equal(1)

    reaction.products[0].atoms.length.should.be.equal(14)
    reaction.products[0].atoms.map(
        (atom) => {
            atom.is_cation.should.be.equal(false)
            atom.is_anion.should.be.equal(false)
        }
    )
    const product_controller = MoleculeController(reaction.products[0])
    const pair = product_controller.findDoubleBondPair(reaction.products[0].atoms, null, 0)
    if (pair !== null) {
        console.log(new Error("Reaction should have removed all double bonds"))
    }

    const carbon_atom = reaction.products[0].atoms.filter(
        (atom, index) => {
            return atom.outer_shell_electrons.filter(
                (electron) => {
                    return undefined !== electron.bond_type && electron.bond_type === "greedy-ionic"
                }
            ).length > 0
        }
    ).pop()

    reaction.products[0].atoms.filter(
        (atom) => atom.atomicSymbol === "C"
    ).length.should.be.equal(4)

    reaction.products[0].atoms.filter(
        (atom) => atom.atomicSymbol === "Cl"
    ).length.should.be.equal(1)

    reaction.products[0].atoms.filter(
        (atom) => atom.atomicSymbol !== "H"
    ).length.should.be.equal(5)

    reaction.products[0].atoms.filter(
        (atom) => atom.atomicSymbol !== "H"
    ).pop().atomicSymbol.should.be.equal("Cl")

    // Product should be a akyl halide
    //reaction.products[0].isAkylHalide().should.be.equal(true)
    const non_hydrogen_atoms = reaction.products[0].atoms.filter(
        (atom) => atom.atomicSymbol !== "H"
    )
    //CC(C)(C)Cl
    non_hydrogen_atoms[0].atomicSymbol.should.be.equal("C")
    non_hydrogen_atoms[1].atomicSymbol.should.be.equal("C")
    non_hydrogen_atoms[2].atomicSymbol.should.be.equal("C")
    non_hydrogen_atoms[3].atomicSymbol.should.be.equal("C")
    non_hydrogen_atoms[4].atomicSymbol.should.be.equal("Cl")

    // First atom should be linked to the second atom
    if (false) {
        non_hydrogen_atoms[1].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[0].__id
            }
        ).length.should.be.equal(1)
        non_hydrogen_atoms[0].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[1].__id
            }
        ).length.should.be.equal(1)

        // Third atom should be linked to the second atom
        non_hydrogen_atoms[2].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[1].__id
            }
        ).length.should.be.equal(1)


        /*
        non_hydrogen_atoms[1].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[2].__id
            }
        ).length.should.be.equal(1)
         */
        // Fourth atom should be linked to the second atom
        non_hydrogen_atoms[3].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[1].__id
            }
        ).length.should.be.equal(1)
        non_hydrogen_atoms[1].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[3].__id
            }
        ).length.should.be.equal(1)

        // Fifth atom should be linked to the second atom
        /*
        non_hydrogen_atoms[4].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[1].__id
            }
        ).length.should.be.equal(1)
         */
        /*
        non_hydrogen_atoms[1].outer_shell_electrons.filter(
            (electron) => {
                return undefined !== electron.bonded_atom && electron.bonded_atom.bonded_atom__id === non_hydrogen_atoms[4].__id
            }
        ).length.should.be.equal(1)
         */
    }

    reaction.products[0].canonical_SMILES.should.be.equal('CC(C)(C)Cl')
// 2-chloro-2-methylpropane
    // CC(C)(C)Cl

}

module.exports = VerifyHydrohalenationReaction