require("dotenv").config()
const should = require('should');
const Reactions = require('../lib/CanonicalSmilesParserv2')
const MoleculeLookup = require('../lib/MoleculeLookup')
const WackerOxidation = require('../lib/reactions/WackerOxidation.js')
const PermanganateOxidation = require('../lib/reactions/PermanganateOxidation.js')
const PinacolRearrangement = require('../lib/reactions/PinacolRearrangement.js')
const FunctionalGroups = require('../lib/FunctionalGroups')
const NagaiMethod = require('../lib/reactions/NagaiMethod.js')

const ReactionsTest = () => {

    const verbose = true
    const methyl_piperonal_ketone = "CC(=O)CC1=CC2=C(C=C1)OCO2"
    const methamphetamine = "CC(CC1=CC=CC=C1)NC"
    const pseudoephedrine = "CC(C(C1=CC=CC=C1)O)NC"
    const isosafroleglycol = "CC(C(C1=CC2=C(C=C1)OCO2)O)O"
    
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

            MoleculeLookup(db, methyl_piperonal_ketone, 'SMILES', true, "", (err) => {
                console.log(err)
            }).then(
                
                (methyl_piperonal_ketone_object) => {


                    methyl_piperonal_ketone_object.functionalGroups = FunctionalGroups(methyl_piperonal_ketone_object).functionalGroups

                    PermanganateOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((canonical_SMILES, substrate_JSON_object, reagents) => {
                        console.log("permanganateOxidationReverse() testing")
                    })

                    WackerOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                        console.log("wackerOxidationReverse testing")
                        substrate.CanonicalSMILES.should.be.equal("C=CCC1=CC2=C(C=C1)OCO2")
                    })

                    PinacolRearrangement(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                        console.log("PinacolRearrangement reverse testing")
                       // substrate.CanonicalSMILES.should.be.equal(isosafroleglycol)
                    })

                }
            )
                    
            MoleculeLookup(db, methamphetamine, 'SMILES', true, "", (err) => {
                console.log(err)
            }).then(     
                
                (methamphetamine_object) => {

                    methamphetamine_object.functionalGroups = FunctionalGroups(methamphetamine_object).functionalGroups
                    
                    // CC(C(C1=CC=CC=C1)O)NC pseudoephedrine
                    // (1S,2S)-2-(methylamino)-1-phenylpropan-1-ol
                    NagaiMethod(methamphetamine_object, db, {}, "", null, null).reverse((canonical_SMILES, substrate_JSON_object, reagents ) => {

                      //  substrate_JSON_object.CanonicalSMILES.should.be.equal(pseudoephedrine)
                        if (substrate_JSON_object.CanonicalSMILES === pseudoephedrine) {
                            console.log("Nagai method passed")
                        }
                        
                        
                    })
                    
                    
                    
                }
                
            )
                    
        })

}

// module.exports = SynthesizeTest
ReactionsTest()







