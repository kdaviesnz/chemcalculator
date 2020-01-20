require("dotenv").config()
const should = require('should');
const Reactions = require('../lib/CanonicalSmilesParserv2')

const ReactionsTest = () => {

    const verbose = true
const methyl_piperonal_ketone = "CC(=O)CC1=CC2=C(C=C1)OCO2"
    MoleculeLookup(db, methyl_piperonal_ketone, 'SMILES', true, "", (err)=>{
        cinsole.log(err)
    }).then(
        (molecule_JSON_object) => {
            console.log("[" + functional_group + "] " + molecule_JSON_object.IUPACName)
            const parser = Reactions(
                molecule_JSON_object,
                db,
                {},
                (canonical_SMILES, substrate_JSON_object, reagents) => {
                }
            )

        }
    )



}

// module.exports = SynthesizeTest
ReactionsTest()







