const MoleculeLookup = require('../../lib/MoleculeLookup')


const AcidCatalyzedRingOpening = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse  = (callback)=> {
        if (false) {
            console.log('calling AcidCatalyzedRingOpening reverse')
        }

        const lookup_err = (err) => {
            console.log('AcidCatalyzedRingOpening reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
 isosafrole glycol
 CC(C(C1=CC2=C(C=C1)OCO2)O)O (isosafrole glycol)
 CCOC(=O)C1(C(O1)C2=CC3=C(C=C2)OCO3)C (ethyl-PMK glycidate) epoxide
 [
 "C(CO)O",
 C,
 H,
 (C1=CC2=C(C=C1)OCO2),
 H
 ]
 CC1(H)OC1(C1=CC2=C(C=C1)OCO2)
 Isosafrole ozonide
 Isosafrole ozonide
 http://online.aurorafinechemicals.com/info?ID=A31.288.487

    const glycol_SMILES = 'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
                // Isosafrole glycol



            CC1()OC1(C1=CC2=C(C=C1)OCO2)
 CC1OC1(C1=CC2=C(C=C1)OCO2)
 5-(3-methyloxiran-2-yl)-1,3-benzodioxole
 CC1C(O1)C2=CC3=C(C=C2)OCO3

       */
        MoleculeLookup(db, (functionalGroups.glycol[1]
            + "C1("
            + functionalGroups.glycol[2]
            + ")OC1(" + functionalGroups.glycol[3]
            + ")"
            + functionalGroups.glycol[4]).replace(/\(\)/,""), "SMILES", true, "AcidCatalyzedRingOpening reverse", lookup_err).then(
            (substrate) => {

                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "AcidCatalyzedRingOpening reverse"
                ):render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "AcidCatalyzedRingOpening reverse"
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

module.exports = AcidCatalyzedRingOpening

