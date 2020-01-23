require("dotenv").config()
const should = require('should');
const Reactions = require('../lib/CanonicalSmilesParserv2')
const MoleculeLookup = require('../lib/MoleculeLookup')
const WackerOxidation = require('../lib/reactions/WackerOxidation.js')
const PermanganateOxidation = require('../lib/reactions/PermanganateOxidation.js')

const ReactionsTest = () => {

    const verbose = true
    const methyl_piperonal_ketone = "CC(=O)CC1=CC2=C(C=C1)OCO2"
const methyl_piperonal_ketone = "CC(CC1=CC=CC=C1)NC"
    
    
    // Connect to mongo database
    const MongoClient = require('mongodb').MongoClient
    const S = require('string');

    MongoClient.connect('mongodb+srv://' + process.env.MONGODBUSER + ':' + process.env.MONGODBPASSWORD + '!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true},
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
                    
                    
                    const parser = Reactions(
                        methyl_piperonal_ketone_object,
                        db,
                        {},
                        (canonical_SMILES, substrate_JSON_object, reagents) => {
                            
                        }
                    )

                    PermanganateOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((canonical_SMILES, substrate_JSON_object, reagents ) => {
                            console.log("permanganateOxidationReverse() testing")
                    })
                    
                    WackerOxidation(methyl_piperonal_ketone_object, db, {}, "", null, null).reverse((rule, methyl_piperonal_ketone_object, substrate, reagents) => {
                         console.log("wackerOxidationReverse testing")
                         substrate.CanonicalSMILES.should.be.equal("C=CCC1=CC2=C(C=C1)OCO2")
                }

            )
        })

}

// module.exports = SynthesizeTest
ReactionsTest()







