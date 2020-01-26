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

       // console.log(molecule_json_object.CanonicalSMILES)
        // CC(C(C1=CC2=C(C=C1)OCO2)O)O
      //  console.log(molecule_json_object.functionalGroups)
        /*
        { ketone: false,
  tertiary_amine: false,
  secondary_amine: false,
  primary_amine: false,
  amide: false,
  epoxide: false,
  ester: false,
  glycol: [ 'C', '', 'C1=CC2=C(C=C1)OCO2', '' ],
  alcohol: false,
  aldehyde: false,
  methyl_ketone: false,
  terminal_alkene: false,
  alkene: [ [ 'CC(C(C1', 'CC2=C(C=C1)OCO2)O)O' ], [ [Array] ] ] }

         */
        console.log("AcidCatalyzedRingOpening Looking up " + molecule_json_object.functionalGroups.glycol[1]
            + "C1("
            + molecule_json_object.functionalGroups.glycol[2]
            + ")OC1(" + molecule_json_object.functionalGroups.glycol[3]
            + ")"
            + molecule_json_object.functionalGroups.glycol[4]).replace(/\(\)/,"")

       process.exit()
        MoleculeLookup(db, (molecule_json_object.functionalGroups.glycol[1]
            + "C1("
            + molecule_json_object.functionalGroups.glycol[2]
            + ")OC1(" + molecule_json_object.functionalGroups.glycol[3]
            + ")"
            + molecule_json_object.functionalGroups.glycol[4]).replace(/\(\)/,""), "SMILES", true, "AcidCatalyzedRingOpening reverse", lookup_err).then(
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

