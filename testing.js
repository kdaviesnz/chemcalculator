// Chem testing
const MoleculeLookup = require('./lib/MoleculeLookup.js')
const ArrheniusAcidicReaction = require('./lib/reactions/ArrheniusAcidicReaction.js')
const ArrheniusBaseReaction = require('./lib/reactions/ArrheniusBaseReaction.js')
const LewisAcidBaseReaction = require('./lib/reactions/LewisAcidBaseReaction.js')
const BronstedLowryAcidBaseReaction = require('./lib/reactions/BronstedLowryAcidBaseReaction.js')
const HomolyticCleavageReaction = require('./lib/reactions/HomolyticCleavageReaction.js')
const FreeRadicalHalogenationReaction = require('./lib/reactions/FreeRadicalHalogenationReaction.js')
const AlkeneToAlkylHalideReaction = require('./lib/reactions/HydrohalogenationReaction.js')

const MongoClient = require('mongodb').MongoClient

/*
#cd /Applications/MAMP/htdocs/chemcalculator
#node testing.js

We look up HNO3 in the database and on success pass the resulting
JSON object to a callback function. This callback function then looks
up H20 and on success passes the resulting JSON object to another
callback function. This callback calls ArrheniusAcidicReaction() which
returns a reaction JSON object.

MoleculeLookup() returns a Promise.

*/

// https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0
MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true}, function (err, client) {

    const db = client.db('chemistry');

    /*
    MoleculeLookup(db, "HNO3").then(
        // "resolves" callback
        (nitric_acid_JSON_object) => {
            console.log("Looked up nitric acid")
            MoleculeLookup(db, "H2O").then(
                // "resolves" callback
                (water_JSON_object) => {
                    console.log("Looked up water")
                    ArrheniusAcidicReaction(nitric_acid_JSON_object, water_JSON_object)
                },
                // "rejects" callback
                (Err) => {
                    console.error(new Error("Cannot load molecule H2O"))
                }
            )

        },
        // "rejects" callback
        (Err) => {
            console.error(new Error("Cannot load molecule HNO3"))
        }
    )
*/

    /*
    MoleculeLookup(db, "KOH").then(
        // "resolves" callback
        (potassium_hydroxide) => {
            ArrheniusBaseReaction(potassium_hydroxide)
        },
        // "rejects" callback
        (Err) => {
            console.error(new Error("Cannot load molecule potassium hydroxide"))
        }
    )
    */


    /*
        MoleculeLookup(db, "HNO3").then(
            // "resolves" callback
            (nitric_acid_JSON_object) => {
                console.log("Looked up nitric acid")
                MoleculeLookup(db, "H2O").then(
                    // "resolves" callback
                    (water_JSON_object) => {
                        console.log("Looked up water")
                        BronstedLowryAcidBaseReaction(nitric_acid_JSON_object, water_JSON_object,(error,reaction)=>{
                            if (null!==error) {
                                console.error(error.message)
                                process.exit()
                            }
                            console.log("Reaction:")
                            console.log(reaction.products.map(
                                (product) => {
                                    return {
                                        "atoms":product.atoms.map(
                                            (atom)=> atom.atomicSymbol
                                        )
                                    }
                                }
                            ))
                        })
                    },
                    // "rejects" callback
                    (Err) => {
                        console.log(Err)
                        console.error(new Error("Cannot load molecule H2O"))
                    }
                )

            },
            // "rejects" callback
            (Err) => {
                console.log(Err)
                console.error(new Error("Cannot load molecule HNO3"))
                process.exit()
            }
        )*/

    /*
        MoleculeLookup(db, "BH3").then(
            // "resolves" callback
            (borane_JSON_object) => {
                console.log("Looked up borane")
                MoleculeLookup(db, "CH3NH2").then(
                    // "resolves" callback
                    (methylamine_JSON_object) => {
                        console.log("Looked up methylamine")
                        LewisAcidBaseReaction(borane_JSON_object, methylamine_JSON_object,(error,reaction)=>{
                            if (null!==error) {
                                console.error(error.message)
                                process.exit()
                            }
                            console.log("Reaction:")
                            console.log(reaction.products.map(
                                (product) => {
                                    return {
                                        "atoms":product.atoms.map(
                                            (atom)=> atom.atomicSymbol
                                        )
                                    }
                                }
                            ))
                        })
                    },
                    // "rejects" callback
                    (Err) => {
                        console.log(Err)
                        console.error(new Error("Cannot load molecule CH3NH2"))
                    }
                )

            },
            // "rejects" callback
            (Err) => {
                console.log(Err)
                console.error(new Error("Cannot load molecule BH3"))
                process.exit()
            }
        )
    */

    /*
    MoleculeLookup(db, "Cl2").then(
        // "resolves" callback
        (chlorine) => {
            HomolyticCleavageReaction(chlorine, (error,reaction) =>{
                if (null!==error) {
                    console.error(error.message)
                    process.exit()
                }
                console.log("Reaction:")
                console.log(reaction.products.map(
                    (atom) => {
                        return {
                            "atom":atom.atomicSymbol
                        }
                    }
                ))
            })
        },
        // "rejects" callback
        (Err) => {
            console.error(new Error("Cannot load molecule Cl2"))
        }
    )
    */

    if (false) {
        MoleculeLookup(db, "CH4", true).then(
            // "resolves" callback
            (alkane_molecule_JSON_object) => {
                console.log("Looked up alkane_molecule")
                MoleculeLookup(db, "Cl2").then(
                    // "resolves" callback
                    (chlorine_JSON_object) => {
                        console.log("Looked up chlorine")
                        FreeRadicalHalogenationReaction(alkane_molecule_JSON_object, chlorine_JSON_object, (error, reaction) => {
                            if (null !== error) {
                                console.error(error.message)
                                process.exit()
                            }

                            console.log("Reaction:")
                            /*
                            Reaction:
    [ { atoms: [ 'Cl', 'H' ] },
      { atoms: [ 'C', 'H', 'H', 'H', 'Cl' ] } ]
                             */
                            console.log(reaction.products.map(
                                (product) => {
                                    return {
                                        "atoms": product.atoms.map(
                                            (atom) => atom.atomicSymbol
                                        )
                                    }
                                }
                            ))
                        })
                    },
                    // "rejects" callback
                    (Err) => {
                        console.log(Err)
                        console.error(new Error("Cannot load molecule Cl2"))
                    }
                )

            },
            // "rejects" callback
            (Err) => {
                console.log(Err)
                console.error(new Error("Cannot load molecule CH4"))
                process.exit()
            }
        )
    }

    if (true) {
        MoleculeLookup(db, "butene", true).then(
            // "resolves" callback
            (alkene_molecule_JSON_object) => {
                console.log("Looked up alkene")
                MoleculeLookup(db, "HCL", true).then(
                    // "resolves" callback
                    (HCL_JSON_object) => {
                        console.log("Looked up HCL")
                        if (null === HCL_JSON_object.atoms) {
                            console.error(new Error("testing.js:: Atoms property of HCL json object should not null"))
                            process.exit()
                        }
                        AlkeneToAlkylHalideReaction(alkene_molecule_JSON_object, HCL_JSON_object, true, (error, reaction) => {
                            if (null !== error) {
                                console.error(error.message)
                                process.exit()
                            }
                            console.log("Reaction:")
                            console.log(reaction.products.map(
                                (product) => {
                                    return {
                                        "atoms": product.atoms.map(
                                            (atom) => atom.atomicSymbol
                                        )
                                    }
                                }
                            ))
                            process.exit()
                        })
                    },
                    // "rejects" callback
                    (Err) => {
                        console.log(Err)
                        console.error(new Error("Cannot load molecule Cl2"))
                    }
                )

            },
            // "rejects" callback
            (Err) => {
                console.log(Err)
                console.error(new Error("Cannot load molecule CH4"))
                process.exit()
            }
        )
    }


})








