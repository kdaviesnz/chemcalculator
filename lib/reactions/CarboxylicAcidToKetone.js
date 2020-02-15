const MoleculeLookup = require('../../lib/MoleculeLookup')

const CarboxylicAcidToKetone = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse = (callback) => {

        if (true) {
            console.log('calling CarboxylicAcidToKetone reverse')
        }

        const lookup_err = (err) => {
            console.log('CarboxylicAcidToKetone reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
CC(=O)CC1=CC2=C(C=C1)OCO2 methyl piperonal ketone
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
terminal_alkene: false,
alkene: [ [ 'CC(=O)CC1', 'CC2=C(C=C1)OCO2' ], [ [Array] ] ] }

 */
        const SMILES_arr = [
            "O=C(" + molecule_json_object.functionalGroups.ketone[1] + ")O", // 2-(1,3-benzodioxol-5-yl)acetic acid C1OC2=C(O1)C=C(C=C2)CC(=O)O
            "O=C(" + molecule_json_object.functionalGroups.ketone[2] + ")O" // acetic acid CC(=O)O
        ]

        // CC(=O)CC1=CC2=C(C=C1)OCO2 methyl piperonal ketone
        //console.log(SMILES_arr)
        /*
        [ 'O=C(CC1=CC2=C(C=C1)OCO2)O', 'O=C(C)O' ]
         */

        const reagents_arr =
            [
                "O(C(=O)" + molecule_json_object.functionalGroups.ketone[2] + ")C(=O)" + molecule_json_object.functionalGroups.ketone[2],
                "O(C(=O)" + molecule_json_object.functionalGroups.ketone[1] + ")C(=O)" + molecule_json_object.functionalGroups.ketone[1]
            ]
        // CC(=O)CC1=CC2=C(C=C1)OCO2 methyl piperonal ketone
       //  console.log(reagents_arr)
        /*
        [ 'O(C(=O)C)C(=O)C',
  'O(C(=O)CC1=CC2=C(C=C1)OCO2)C(=O)CC1=CC2=C(C=C1)OCO2' ]
         */

        
        reagents_arr.map(
            (reagent_SMILES, i) => {
                if (reagent_SMILES === false) {
                    return false
                }
                
                MoleculeLookup(db, reagent_SMILES, "SMILES", true, "CarboxylicAcidToKetone reverse reagent lookup", lookup_err).then(
                    (reagent) => {
                        const substrate_SMILES = SMILES_arr[i]
                        if (substrate_SMILES === false) {
                             return false
                        }
                        MoleculeLookup(db, substrate_SMILES, "SMILES", true, "CarboxylicAcidToKetone reverse", lookup_err).then(
                    (substrate) => {
                        callback?callback(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents.indexOf('acyclic carboxylic anhydride')>-1?
                                [reagent.IUPACName]:rule.reagents,
                            child_reaction_as_string,
                            "CarboxylicAcidToKetone reverse"
                        ):render(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents.indexOf('acyclic carboxylic anhydride')>-1?
                                [reagent.IUPACName]:rule.reagents,
                            child_reaction_as_string,
                            "CarboxylicAcidToKetone reverse"
                        )

                    },
                    (err) => {
                        lookup_err(err)
                    }
                )
                    }
                )  
            }
        )
        
        


    }


    return {
        reaction: reaction,
        reverse: reverse
    }

}

module.exports = CarboxylicAcidToKetone
