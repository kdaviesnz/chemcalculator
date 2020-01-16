const MoleculeLookup = require('../lib/MoleculeLookup')
const MongoClient = require('mongodb').MongoClient
const AtomsController = require('../lib/controllers/AtomsController')
const MoleculeController = require('../lib/controllers/MoleculeController')
const HydrohalogenationReaction = require('../lib/reactions/HydrohalogenationReaction')
const _ = require('lodash');
const VerifyHydrohalogenationReaction = require('./VerifyHydrohalogenationReaction')

const HydrohalogenationReactionTest = () => {

    MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true}, function (err, client) {

            const db = client.db('chemistry');

            MoleculeLookup(db, "isobutene", true).then(
                (alkene_molecule_JSON_object) => {


                    alkene_molecule_JSON_object.should.have.property("canonical_SMILES")
                    alkene_molecule_JSON_object.canonical_SMILES.should.be.equal("CC(=C)C")

                    // We must use _.map() as other wise AtomsController will change alkene_molecule_JSON_object.atoms by removing the hydrogens.
                    const atoms_controller = AtomsController(_.map(alkene_molecule_JSON_object.atoms, _.clone))

                    atoms_controller.should.be.a.Object()
                    atoms_controller.should.have.property("number_double_bonds")
                    atoms_controller.number_double_bonds.should.be.a.Number()
                    atoms_controller.number_double_bonds.should.be.equal(1)
                    atoms_controller.should.have.property('has_all_carbons')
                    atoms_controller.has_all_carbons.should.be.equal(true)

                    alkene_molecule_JSON_object.should.have.property('is_alkene')
                    alkene_molecule_JSON_object.is_alkene.should.be.equal(true)

                    const alkene_molecule_controller = MoleculeController(alkene_molecule_JSON_object)
                    alkene_molecule_controller.should.be.a.Object()
                    alkene_molecule_controller.should.have.property('halfArrowPush')
                    alkene_molecule_controller.should.have.property('findCationIndexRecursive')
                    alkene_molecule_controller.should.have.property('findDoubleBondPair')
                    alkene_molecule_controller.should.have.property('findAtomIndexWithDoubleBondsRecursive')
                    alkene_molecule_controller.should.have.property('addBond')
                    alkene_molecule_controller.should.have.property('breakBonds')
                    alkene_molecule_controller.should.have.property('acceptElectronPair')
                    alkene_molecule_controller.should.have.property('findFreeRadicalAtomByAtomicSymbolIndex')
                    alkene_molecule_controller.should.have.property('findAtomByAtomicSymbolIndex')
                    alkene_molecule_controller.should.have.property('pop')
                    alkene_molecule_controller.should.have.property('push')
                    alkene_molecule_controller.should.have.property('proton')
                    alkene_molecule_controller.should.have.property('addProton')
                    alkene_molecule_controller.should.have.property('breakMolecule')
                    alkene_molecule_controller.should.have.property('popMolecule')

                    const double_bond_index = alkene_molecule_controller.findAtomIndexWithDoubleBondsRecursive(alkene_molecule_JSON_object.atoms, "C", 0)
                    double_bond_index.should.equal(1)

                    const alkene_molecule_double_bond_atom_pair= alkene_molecule_controller.findDoubleBondPair(alkene_molecule_JSON_object.atoms, "C", "C", 0)
                    should.exist(alkene_molecule_double_bond_atom_pair[0])
                    should.exist(alkene_molecule_double_bond_atom_pair[1])

                    alkene_molecule_JSON_object.atoms.map(
                        (atom, i) => {
                            if (atom.atomicSymbol==='C') {
                                atom.outer_shell_electrons.length.should.be.equal(4)
                            }
                        }
                    )

                    MoleculeLookup(db, "HCL", true).then(
                        (HCL_JSON_object) => {

                            HCL_JSON_object.should.have.property('tag');
                            HCL_JSON_object.tag.should.be.a.String();
                            HCL_JSON_object.tag.should.equal('HCL')
                            HCL_JSON_object.should.have.property('atoms');
                            HCL_JSON_object.atoms.should.be.a.Object();
                            HCL_JSON_object.atoms.length.should.equal(2)

                            HCL_JSON_object.atoms = HCL_JSON_object.atoms.reverse()
                            HCL_JSON_object.molecular_formula = "HCL"

                            HCL_JSON_object.atoms[0].should.have.property('protons');
                            HCL_JSON_object.atoms[0].protons.length.should.be.equal(1)

                            // const ProtonationReaction = (hydrogen_atom, target_molecule, target_molecule_atom_index, hydrogen_atom_proton_source_molecule, do_verification_checks, callback)
                            // ProtonationReaction is used by HydrohalogenationReaction so we need to make sure it's working correctly.
                            /*
                             ProtonationReaction(HCL_JSON_object.atoms[0], alkene_molecule_JSON_object, double_bond_index, HCL_JSON_object, true, (Err, reaction) => {

                                 if (null !== Err) {
                                     should.ifError(Err);
                                     process.exit()
                                 }

                                 reaction.products.length.should.equal(2)

                                 const alkene_molecule_with_cation = reaction.products[0]
                                 // Verify that the atom on the double bond is a cation
                                 alkene_molecule_with_cation.atoms[2].should.be.a.Object()
                                 alkene_molecule_with_cation.atoms[2].should.have.property('is_cation')
                                 alkene_molecule_with_cation.atoms[2].is_cation.should.equal(true)

                                 const HCL_with_anion = reaction.products[1]
                                 // Verify that the atom on the HCL is an anion
                                 HCL_with_anion.atoms[0].should.be.a.Object()
                                 HCL_with_anion.atoms[0].should.have.property('is_anion')
                                 HCL_with_anion.atoms[0].is_anion.should.equal(true)
                                 HCL_with_anion.atoms[0].protons.length.should.equal(0)

                             })
                             */
                            // CCC=C
                            alkene_molecule_JSON_object.atoms[2].outer_shell_electron_count.should.be.equal(4)
                            alkene_molecule_JSON_object.atoms[2].proton_count.should.equal(6)


                            // Check for cations and anions - we shouldn't have any
                            alkene_molecule_JSON_object.atoms.map(
                                (atom, index) => {
                                    atom.is_anion.should.be.equal(false)
                                    atom.is_cation.should.be.equal(false)
                                }
                            )

                            // Check for cations and anions - we shouldn't have any
                            HCL_JSON_object.atoms.map(
                                (atom, index) => {
                                    atom.is_anion.should.be.equal(false)
                                    atom.is_cation.should.be.equal(false)
                                }
                            )


                            HydrohalogenationReaction(alkene_molecule_JSON_object, HCL_JSON_object, true, db, (Err, reaction) => {

                                if (null !== Err) {
                                    should.ifError(Err);
                                    process.exit()
                                }

                                VerifyHydrohalogenationReaction(reaction)

                            })

                        },
                        (Err) => {
                            should.ifError(Err);
                            process.exit()
                        }

                    )



                },
                (Err) => {
                    should.ifError(Err);
                    process.exit()
                }
            )

        }
    )
}

module.exports = HydrohalogenationReactionTest