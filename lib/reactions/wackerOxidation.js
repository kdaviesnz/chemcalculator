

const wackerOxidation = (molecule_json_object, rule, child_reaction_as_string, render) => {

    const reverse = (callback) => {

        if (false) {
            console.log('calling wackerOxidationReverse()')
        }

        const lookup_err = (err) => {
            console.log('wackerOxidationReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // ADD oxygen DOUBLE BOND TO terminal alkene ON MOST SUBSTITUTED carbon(do reverse of)
        if (molecule.functionalGroups.ketone===false || (functionalGroups.ketone[1]!=="C" && functionalGroups.ketone[2]!=="C")) {
            return false
        }

        /*
        calling wackerOxidationReverse()
{ ketone: [ 'O', 'CC1=CC2=C(C=C1)OCO2', 'C' ],
  tertiary_amine: false,
  secondary_amine: false,
  primary_amine: false,
  amide: false,
  epoxide: false,
  ester: false,
  glycol: false,
  alcohol: false,
  aldehyde: false,
  methyl_ketone: [ 'O', 'CC1=CC2=C(C=C1)OCO2', 'C' ],
  terminal_alkene: false }
Looking up CC1=CC2=C(C=C1)OCO2(=C)C

         */
        MoleculeLookup(db,
            "C=C" +
            molecule.functionalGroups.ketone.filter(
            (SMILES) => {
                return SMILES !== "C"
            }
            ).pop(),

            "SMILES", true, "wackerOxidationReverse", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "wackerOxidationReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "wackerOxidationReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }


}

module.exports = wackerOxidation
