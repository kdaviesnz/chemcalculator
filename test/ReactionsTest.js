require("dotenv").config()
const should = require('should');
const Reactions = require('../lib/CanonicalSmilesParserv2')
const MoleculeLookup = require('../lib/MoleculeLookup')

const ReactionsTest = () => {

    const verbose = true
    const methyl_piperonal_ketone = "CC(=O)CC1=CC2=C(C=C1)OCO2"

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
                    
                    parser.permanganateOxidationReverse((canonical_SMILES, substrate_JSON_object, reagents) => {
                            console.log("permanganateOxidationReverse() testing")
                    })
                    
                    parser.wackerOxidationReverse((canonical_SMILES, substrate_JSON_object, reagents) => {
                         console.log("permanganateOxidationReverse() testing")
                    })
                    
                }
                
                
            )
        })

}

// module.exports = SynthesizeTest
ReactionsTest()







