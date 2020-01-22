

const PinacolRearrangement = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

// 'O=C(C)Cc1ccc2OCOc2c1 MDP2P
// isosafrole glycol
//    isosafrole glycol - pinacol rearrangement -> MDP2P
// CC(C(C1=CC2=C(C=C1)OCO2)O)O isosafrole glycol
    const reverse = (callback)=> {
        if (false) {
            console.log('calling pinacolRearrangemenReverse()')
        }

        const lookup_err = (err) => {
            console.log('pinacolRearrangemenReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        // MDP2P
        // CC(=O)CC1=CC2=C(C=C1)OCO2

        /*
        ketone:
 [ 'O', 'CC1=CC2=C(C=C1)OCO2', 'C ]
 CO(C(O)CC1=CC2=C(C=C1)OCO2)
         */

        /*
        calling pinacolRearrangemenReverse()
        Looking up
        OC(C)C(O)C1=CC2=C(C=C1)OCO2

         */
        MoleculeLookup(db, "O" + "C(C)C(O)" + molecule_json_object.functionalGroups.ketone[1].substr(1), "SMILES", true, "pinacolRearrangemenReverse", lookup_err).then(
            (substrate) => {

                callback ? callback(
                    rule,
                    molecule_json_object.CanonicalSMILES,
                    "O" + "C(C)C(O)" + functionalGroups.ketone[1].substr(1),
                    rule.reagents,
                    child_reaction_as_string,
                    "pinacolRearrangemenReverse"
                    ) :
                    render(
                        rule,
                        molecule_json_object.CanonicalSMILES,
                        "O" + "C(C)C(O)" + functionalGroups.ketone[1].substr(1),
                        rule.reagents,
                        child_reaction_as_string,
                        "pinacolRearrangemenReverse()"
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

module.exports = PinacolRearrangement
