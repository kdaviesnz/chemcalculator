
// test/index.js
const should = require('should');
const MongoClient = require('mongodb').MongoClient



const MoleculeLookup = require('../lib/MoleculeLookup.js')


const MoleculeController = require('../lib/controllers/MoleculeController.js')
MoleculeController.should.be.a.Function()

const ArrheniusAcidicReaction = require('../lib/reactions/ArrheniusAcidicReaction.js')
const ArrheniusBaseReaction = require('../lib/reactions/ArrheniusBaseReaction.js')
const LewisAcidBaseReaction = require('../lib/reactions/LewisAcidBaseReaction.js')
const BronstedLowryAcidBaseReaction = require('../lib/reactions/BronstedLowryAcidBaseReaction.js')
const HomolyticCleavageReaction = require('../lib/reactions/HomolyticCleavageReaction.js')
const FreeRadicalHalogenationReaction = require('../lib/reactions/FreeRadicalHalogenationReaction.js')
const HydrohalogenationReaction = require('../lib/reactions/HydrohalogenationReaction.js')
const ProtonationReaction = require('../lib/reactions/ProtonationReaction.js')
const RecursiveStabilisationReaction = require('../lib/reactions/RecursiveStabilisationReaction')
const Nomenclature = require('../lib/Nomenclature')
const ReactionSchemaParser = require('../lib/ReactionSchemaParser')

should.exist(MoleculeLookup);
should.exist(ArrheniusAcidicReaction);
should.exist(ArrheniusBaseReaction);
should.exist(LewisAcidBaseReaction);
should.exist(BronstedLowryAcidBaseReaction);
should.exist(HomolyticCleavageReaction);
should.exist(FreeRadicalHalogenationReaction);
should.exist(HydrohalogenationReaction);
should.exist(MoleculeController);
should.exist(ProtonationReaction);
should.exist(MongoClient);
should.exist(ReactionSchemaParser)

MoleculeLookup.should.be.a.Function()
ArrheniusAcidicReaction.should.be.a.Function()
ArrheniusBaseReaction.should.be.a.Function()
LewisAcidBaseReaction.should.be.a.Function()
BronstedLowryAcidBaseReaction.should.be.a.Function()
HomolyticCleavageReaction.should.be.a.Function()
FreeRadicalHalogenationReaction.should.be.a.Function()
HydrohalogenationReaction.should.be.a.Function()
ProtonationReaction.should.be.a.Function()
Nomenclature.should.be.a.Function()
ReactionSchemaParser.should.be.a.Object()



// Isopropylamine
// N-TERT-BUTYLBUTANE-1,4-DIAMINE
// SEC-BUTYLAMINE


const verifyHydroHalogenation = (reaction) => {
    // reaction.products
    // Should have only one product
    // Product should have no cations
    // Product should have no anions
    // Product should have 13  atoms
    // Product should have no double bonds
    // Chlorine atom should be bonded to third carbon
    reaction.products.length.should.be.equal(1)
    reaction.products[0].atoms.length.should.be.equal(13)
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
    const chlorine_atom = reaction.products[0].atoms[reaction.products[0].atoms.length - 1]
    chlorine_atom.atomicSymbol.should.be.equal("Cl")

    const carbon_atom = reaction.products[0].atoms.filter(
        (atom, index) => {
            return atom.outer_shell_electrons.filter(
                (electron) => {
                    return undefined !== electron.bond_type && electron.bond_type === "greedy-ionic"
                }
            ).length > 0
        }
    ).pop()

    chlorine_atom.outer_shell_electrons[0].ref.should.be.equal(carbon_atom.outer_shell_electrons[0].__id)
    carbon_atom.outer_shell_electrons[0].ref.should.be.equal(chlorine_atom.outer_shell_electrons[0].__id)

}

MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true}, function (err, client) {

    const db = client.db('chemistry');

    if (false) {

        let molecule_smiles
        let schema
        let product
        let solvent

        schema = "CCCBR add three member ring"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")

        schema = "C=C break double bond"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("C=C")

        schema = "CCCBR -> HaCN|O ="
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")
        solvent = ReactionSchemaParser.extractSolventFromSchema(schema)
        solvent.should.be.equal('O')

        schema = "CCCBR remove BR"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")
        product = ReactionSchemaParser.extractProductFromSchema(schema, molecule_smiles)
        product.should.be.equal("CCC")

        schema = "CCCBR substitute BR for CN"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")
        product = ReactionSchemaParser.extractProductFromSchema(schema, molecule_smiles)
        product.should.be.equal("CCCCN")

        schema = "CCCBR add CN"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")

        schema = "CCCBR + CN"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")

        schema = "CCCBR ? CCCCN"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_smiles.should.be.equal("CCCBR")
        product = ReactionSchemaParser.extractProductFromSchema(schema, molecule_smiles)
        product.should.be.equal("CCCCN")

        schema = "C=C break double bond"
        molecule_smiles = ReactionSchemaParser.extractMoleculeFromSchema(schema)

        var molecule_JSON_object = {
            is_alkene: true
        }

        let reagent
        reagent = ReactionSchemaParser.determineReagent(schema, molecule_JSON_object)
        reagent.should.be.oneOf(["H2O2", "peroxy acid"])

        schema = "CC=CBR -> HaCN|O ="
        reagent = ReactionSchemaParser.determineReagent(schema, molecule_JSON_object)
        reagent.should.be.equal(' HaCN')

        schema = "CC=CBR add O"
        reagent = ReactionSchemaParser.determineReagent(schema, molecule_JSON_object)
        reagent.should.be.oneOf(["OsO4", "CrO3", "O3", "KMnO4", "H2O2"])
        molecule_JSON_object = {
            is_keytone: true
        }
        reagent = ReactionSchemaParser.determineReagent(schema, molecule_JSON_object)
        reagent.should.be.equal('peroxy acid')

        schema = "CC=CBR add three member ring"
        molecule_JSON_object = {
            is_alkene: true
        }
        reagent = ReactionSchemaParser.determineReagent(schema, molecule_JSON_object)
        reagent.should.be.oneOf(["H2O2", "peroxy acid"])

        schema = "butene -> HCL = "
        molecule_name = ReactionSchemaParser.extractMoleculeFromSchema(schema)
        molecule_name.should.be.equal('butene')
        MoleculeLookup(db, molecule_name, true).then(
            // "resolves" callback
            (alkene_molecule_JSON_object) => {
                reagent = ReactionSchemaParser.determineReagent(schema, alkene_molecule_JSON_object)
                reagent.should.be.equal("HCL")
            },
            (err) => {
                console.log("Error looking up butene")
                process.exit()
            }
        )

        ReactionSchemaParser.ReactionSchemaParser(schema, (err, reaction)=> {
            if (err) {
                console.log("Error doing reaction")
                console.log(err)
                process.exit()
            }
            console.log("Reaction done")
            verifyHydroHalogenation(reaction)
        })


    }

    if (false) {


        MoleculeLookup(db, "3-methylpentane", true).then(
            // "resolves" callback
            (alkane_molecule_JSON_object) => {
                /*
                CCC(C)CC

                            |
                          \/ \/

              1 17doe5cajuuatfif -> ,17doe5cajuuatfiq
2 17doe5cajuuatfiq -> ,17doe5cajuuatfif,17doe5cajuuatfj1
3 17doe5cajuuatfj1 -> ,17doe5cajuuatfiq,17doe5cajuuatfjc,17doe5cajuuatfjn
4 17doe5cajuuatfjc -> ,17doe5cajuuatfj1
5 17doe5cajuuatfjn -> ,17doe5cajuuatfj1,17doe5cajuuatfjy
6 17doe5cajuuatfjy -> ,17doe5cajuuatfjn


                                               17doe5cajuuatfjc



                  17doe5cajuuatfif            17doe5cajuuatfj1                            17doe5cajuuatfjy

                             17doe5cajuuatfiq                      17doe5cajuuatfjn




               0     17doe5cajuuatfif  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjc,17doe5cajuuatfjn,17doe5cajuuatfjy]
               1     17doe5cajuuatfiq  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjc,17doe5cajuuatfjn,17doe5cajuuatfjy]
               2     17doe5cajuuatfj1  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjc,17doe5cajuuatfjn,17doe5cajuuatfjy]
               3     17doe5cajuuatfjc  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn,17doe5cajuuatfjy]
               0     17doe5cajuuatfif  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn,17doe5cajuuatfjy]
               1     17doe5cajuuatfiq  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn,17doe5cajuuatfjy]
               2     17doe5cajuuatfj1  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn,17doe5cajuuatfjy]
               3     17doe5cajuuatfjn  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn,17doe5cajuuatfjy]
               4     17doe5cajuuatfjy  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]
               0     17doe5cajuuatfif  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]
               1     17doe5cajuuatfiq  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]
               2     17doe5cajuuatfj1  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]
               3     17doe5cajuuatfjn  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]

               4     17doe5cajuuatfjy  [17doe5cajuuatfif,17doe5cajuuatfiq,17doe5cajuuatfj1,17doe5cajuuatfjn]





                 */


                // Give the alkane molecue some additional properties
                alkane_molecule_JSON_object.atoms.map(
                    (atom, index) => {
                        atom.name = "atom " + (index+1)
                        return atom
                    }
                )


                carbons = alkane_molecule_JSON_object.atoms.filter(
                    (atom) => atom.atomicSymbol === "C"
                )

                /*
                console.log("Carbon atoms:")
                carbons.map(
                    (atom, i) => console.log((i+1) + ' ' + atom.__id + " -> " + atom.outer_shell_electrons.reduce(
                        (carry, electron) => {
                            if (undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol !=="H") {
                                carry = carry + "," + electron.bonded_atom.bonded_atom__id
                            }
                            return carry
                       },
                       ''
                    ))
                )
                 */

                // Verify the third carbon atom has 3 carbon bonds
                carbons[2].outer_shell_electrons.filter(
                    (electron) => undefined !== electron.bonded_atom && electron.bonded_atom.atomicSymbol === "C"
                ).length.should.be.equal(3)


                MoleculeController.should.be.a.Function()

                const nomenclature = Nomenclature(alkane_molecule_JSON_object)
                nomenclature.should.be.an.Object()
                nomenclature.should.have.property('calcLongestCarbonChain')

                const longest_chain = nomenclature.calcLongestCarbonChain()
                longest_chain.length.should.be.equal(5)

                const substituent_index_top_to_bottom = nomenclature.findIndexOfFirstSubstituent(longest_chain)
                substituent_index_top_to_bottom.should.be.equal(2)
                const substituent_index_bottom_to_top = nomenclature.findIndexOfFirstSubstituent(longest_chain.reverse())
                substituent_index_bottom_to_top.should.be.equal(2)

                const longest_chain_numbered = nomenclature.numberChain(longest_chain)
                longest_chain_numbered[0].should.have.property('number')
                longest_chain_numbered[0].number.should.be.equal(1)
                longest_chain_numbered[longest_chain_numbered.length-1].number.should.be.equal(longest_chain_numbered.length)

                const chain_with_subst_names = nomenclature.nameSubsituents(longest_chain_numbered)
                chain_with_subst_names[2].should.have.property("substituent_name")
                chain_with_subst_names[2].substituent_name.should.be.equal('methyl')

                const substs = nomenclature.fetchSubstituentsNamesAlphabetically(chain_with_subst_names)
                substs.should.be.String()
                substs.should.be.equal('3-methyl')

                const trunk_name = nomenclature.determineTrunkName(longest_chain)
                trunk_name.should.be.a.String()
                trunk_name.should.be.equal('pentane')

                const subst_count_map = nomenclature.substCountMap(chain_with_subst_names)
                subst_count_map.should.be.a.Object()
                subst_count_map.should.have.property('methyl')
                subst_count_map['methyl'].should.be.equal(1)

                const subst_prefixes_map = nomenclature.substPrefixesMap(chain_with_subst_names)
                subst_prefixes_map.should.be.a.Object()
                subst_prefixes_map.should.have.property('methyl')
                subst_prefixes_map['methyl'].should.be.equal("")

                const molecule_name = nomenclature.determineName()
                molecule_name.should.be.a.String()
                molecule_name.should.be.equal('3-methylpentane')

                console.log("Passed nomenclature tests")
                process.exit("Passed nomenclature tests")


            },
            (Err) => {
                console.log(Err)
                should.ifError(Err);
                process.exit()
            }
        )

    }


    if (false) {
        MoleculeLookup(db, "butene", true).then(
            // "resolves" callback
            (alkene_molecule_JSON_object) => {

                alkene_molecule_JSON_object.should.have.property('tag');
                alkene_molecule_JSON_object.tag.should.be.a.String();
                alkene_molecule_JSON_object.tag.should.equal('butene')
                alkene_molecule_JSON_object.should.have.property('atoms');
                alkene_molecule_JSON_object.atoms.should.be.a.Object();
                alkene_molecule_JSON_object.atoms.length.should.equal(12)

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
                double_bond_index.should.equal(2)

                const alkene_molecule_double_bond_atom_pair= alkene_molecule_controller.findDoubleBondPair(alkene_molecule_JSON_object.atoms, "C", "C", 0)
                should.exist(alkene_molecule_double_bond_atom_pair[0])
                should.exist(alkene_molecule_double_bond_atom_pair[1])

                MoleculeLookup(db, "HCL", true).then(
                    (HCL_JSON_object) => {

                        console.log("Looked up HCL")

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

                        HydrohalogenationReaction(alkene_molecule_JSON_object, HCL_JSON_object, true, (Err, reaction) => {
                            if (null !== Err) {
                                should.ifError(Err);
                                process.exit()
                            }

                            verifyHydroHalogenation(reaction)

                            console.log("test/index.js - finished reaction")

                        })


                    },
                    // "rejects" callback for HCL molecule lookup
                    (Err) => {
                        should.ifError(Err);
                        process.exit()
                    }
                )

            },
            // "rejects callback
            (Err) => {
                should.ifError(Err);
                process.exit()
            }
        )

    }

})