const MoleculeLookup = require('../../lib/MoleculeLookup')


const AlcoholDehydration = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse  = (callback)=> {
        if (false) {
            console.log('calling AlcoholDehydration reverse')
        }

        const lookup_err = (err) => {
            console.log('AlcoholDehydration reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        if (molecule_json_object.CanonicalSMILES.substr(molecule_json_object.CanonicalSMILES.length-3) === "C=C") {
            const substrate_SMILES = molecule_json_object.CanonicalSMILES.replace("/C\=C$", "O")
        } else if (molecule_json_object.CanonicalSMILES.substr(0,3) === "C=C") {
            // C=CC OC
            const substrate_SMILES = molecule_json_object.CanonicalSMILES.replace("/^C\=C", "OC")
        }

        if (undefined === substrate_SMILES) {
            return false
        }

        MoleculeLookup(db, (glycol_components_with_hydrogens[0]
            + "C9(" + glycol_components_with_hydrogens[1] + ")C(O9)("
            + glycol_components_with_hydrogens[3] + ")"
            + glycol_components_with_hydrogens[2]), "SMILES", true, "AcidCatalyzedRingOpening reverse", lookup_err).then(
            (substrate) => {

                // CC1C(O1)C2=CC3=C(C=C2)OCO3
               // console.log(substrate)
                // process.exit()

                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "AlcoholDehydration reverse"
                ):render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "AlcoholDehydration reverse"
                )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    return {
        reaction: reaction,
        reverse: reverse
    }

}

module.exports = AlcoholDehydration

