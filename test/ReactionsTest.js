require("dotenv").config()
const should = require('should');
const MoleculeLookup = require('../lib/MoleculeLookup')
const WackerOxidation = require('../lib/reactions/WackerOxidation.js')
const PermanganateOxidation = require('../lib/reactions/PermanganateOxidation.js')
const PinacolRearrangement = require('../lib/reactions/PinacolRearrangement.js')
const CarboxylicAcidToKetone = require('../lib/reactions/CarboxylicAcidToKetone.js')
const FunctionalGroups = require('../lib/FunctionalGroups')
const NagaiMethod = require('../lib/reactions/NagaiMethod.js')
const Oxymercuration = require('../lib/reactions/Oxymercuration.js')
const ReductiveAmination = require('../lib/reactions/ReductiveAmination.js')
const AcidCatalysedRingOpening = require('../lib/reactions/AcidCatalyzedRingOpening.js')
const AlcoholDehydration = require('../lib/reactions/AlcoholDehydration.js')
const AkylHalideDehydration = require('../lib/reactions/AkylHalideDehydration.js')

const ReactionsTest = () => {

    const verbose = true
    const methyl_piperonal_ketone = "CC(=O)CC1=CC2=C(C=C1)OCO2"
    const methamphetamine = "CC(CC1=CC=CC=C1)NC"
    const pseudoephedrine = "CC(C(C1=CC=CC=C1)O)NC"
    const isosafroleglycol = "CC(C(C1=CC2=C(C=C1)OCO2)O)O"
    const isosafroloxyd = "CC1C(O1)C2=CC3=C(C=C2)OCO3"
    const safrole = "C=CCC1=CC2=C(C=C1)OCO2"
    const homopiperonylalcohol = "C=CCC1=CC2=C(C=C1)OCO2" // "OCCC1=CC2=C(C=C1)OCO2"
    
    // Connect to mongo database
    const MongoClient = require('mongodb').MongoClient
    const S = require('string');

    MongoClient.connect('mongodb+srv://' + process.env.MONGODBUSER + ':' + process.env.MONGODBPASSWORD + '@cluster0-awqh6.mongodb.net', {useNewUrlParser: true},
        function (err, client) {

            console.log('Connecting to MONGO')
            if (err) {
                console.log(err)
                process.exit()
            }
            const db = client.db('chemistry');

            if (false) {
                MoleculeLookup(db, safrole, 'SMILES', true, "", (err) => {
                    console.log(err)
                }).then(
                    (safrole_object) => {
                        safrole_object.functionalGroups = FunctionalGroups(safrole_object).functionalGroups
                        AlcoholDehydration(safrole_object, db, {}, "", null, null).reverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                            console.log("Ran AlcoholDehydration test")
                            // OCCC1=CC2=C(C=C1)OCO2
                            substrate_JSON_object.CanonicalSMILES.should.be.equal(homopiperonylalcohol)
                        })
                    }
                )
            }

            if (true) {
                MoleculeLookup(db, safrole, 'SMILES', true, "", (err) => {
                    console.log(err)
                }).then(
                    (safrole_object) => {
                        safrole_object.functionalGroups = FunctionalGroups(safrole_object).functionalGroups
                        AkylHalideDehydration(safrole_object, db, {}, "", null, null).reverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                            console.log("Ran AkylHalideDehydration test")
                            // ["Cl", "Br", "[At]", "F", "I"]
                            substrate_JSON_object.CanonicalSMILES.should.be.oneOf(
                                [
                                    "ClCCCC1=CC2=C(C=C1)OCO2",
                                    "BrCCCC1=CC2=C(C=C1)OCO2",
                                    "[At]CCCC1=CC2=C(C=C1)OCO2",
                                    "FCCCC1=CC2=C(C=C1)OCO2",
                                    "ICCCC1=CC2=C(C=C1)OCO2"
                                ]
                            )
                        })
                    }
                )
            }

            if (false) {
                MoleculeLookup(db, isosafroleglycol, 'SMILES', true, "", (err) => {
                    console.log(err)
                }).then(
                    (isosafroleglycol_object) => {

                        isosafroleglycol_object.functionalGroups = FunctionalGroups(isosafroleglycol_object).functionalGroups

                        AcidCatalysedRingOpening(isosafroleglycol_object, db, {}, "", null, null).reverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                            console.log("Ran AcidCatalysedRingOpening test")
                            substrate_JSON_object.CanonicalSMILES.should.be.equal(isosafroloxyd)
                        })

                    }
                )
            }

            if (false) {
                MoleculeLookup(db, methyl_piperonal_ketone, 'SMILES', true, "", (err) => {
                    console.log(err)
                }).then(
                    (methyl_piperonal_ketone_object) => {


                        methyl_piperonal_ketone_object.functionalGroups = FunctionalGroups(methyl_piperonal_ketone_object).functionalGroups


                        if (true) {
                            PermanganateOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((canonical_SMILES, substrate_JSON_object, reagents) => {
                                console.log("permanganateOxidationReverse() testing")
                                console.log(substrate_JSON_object)
                            })
                        }


                        if (true) {

                            Oxymercuration(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                                console.log("oxymercuration test")
                                console.log(substrate.CanonicalSMILES)
                                substrate.CanonicalSMILES.should.be.equal("C#CCC1=CC2=C(C=C1)OCO2")


                            })

                            WackerOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                                substrate.CanonicalSMILES.should.be.equal("C=CCC1=CC2=C(C=C1)OCO2")
                            })

                            PinacolRearrangement(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                                substrate.CanonicalSMILES.should.be.equal(isosafroleglycol)
                            })

                            CarboxylicAcidToKetone(methyl_piperonal_ketone_object, db, {reagents: ['acyclic carboxylic anhydride']}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                                console.log("Carboxylic acid to ketone reverse testing")
                                console.log("Substrate:")
                                console.log(substrate.CanonicalSMILES)
                                // C1OC2=C(O1)C=C(C=C2)CC(=O)O
                                // CC(=O)O
                                console.log("Reagents")
                                console.log(reagents)
                                // [ 'O(C(=O)C)C(=O)C' ]
                                // [ 'O(C(=O)CC1=CC2=C(C=C1)OCO2)C(=O)CC1=CC2=C(C=C1)OCO2' ]
                                //
                                // substrate.CanonicalSMILES.should.be.equal(isosafroleglycol)
                            })

                        }

                    }
                )

            }

            if (false) {
                MoleculeLookup(db, methamphetamine, 'SMILES', true, "", (err) => {
                    console.log(err)
                }).then(
                    (methamphetamine_object) => {

                        methamphetamine_object.functionalGroups = FunctionalGroups(methamphetamine_object).functionalGroups

                        ReductiveAmination(methamphetamine_object, db, {}, "", null, null).reverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                            substrate_JSON_object.CanonicalSMILES.should.be.oneOf(["C=O", "CC(=O)CC1=CC=CC=C1" ])
                        })

                        // CC(C(C1=CC=CC=C1)O)NC pseudoephedrine
                        // (1S,2S)-2-(methylamino)-1-phenylpropan-1-ol
                        NagaiMethod(methamphetamine_object, db, {}, "", null, null).reverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {

                            //  substrate_JSON_object.CanonicalSMILES.should.be.equal(pseudoephedrine)

                            if (substrate_JSON_object.CanonicalSMILES === pseudoephedrine) {
                                console.log("Nagai method passed")
                            }

                        })

                    }
                )
            }
                    
        })

}

// module.exports = SynthesizeTest
ReactionsTest()







