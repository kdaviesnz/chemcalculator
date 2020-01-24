const MoleculeLookup = require('../../lib/MoleculeLookup')
const range = require("range");

const CarboxylicAcidToKetone = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse = (callback) => {

        if (false) {
            console.log('calling CarboxylicAcidToKetone reverse')
        }

        const lookup_err = (err) => {
            console.log('CarboxylicAcidToKetone reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        /*
         phenylacetic acid
         C1=CC=C(C=C1)CC(=O)O
         R1 C(=O)O
         +
         Acetic anhydride
         CC(=O)OC(=O)C
         R2C(=O)OC(=O)R3
             =
             Phenylacetone
         CC(=O)CC1=CC=CC=C1
         R1 C(=O)R2

          const ketone_SMILES = 'CC(=O)CC1=CC2=C(C=C1)OCO2'  // MDP2P

 // C(C)=O
 // O=C(C)
       ketone: ['O', 'CC1=CC2=C(C=C1)OCO2', 'C']
      "O=C(CC1=CC2=C(C=C1)OCO2)O",
                "O=C(C)O"
        */
        const SMILES_arr = [
            "O=C(" + functionalGroups.ketone[1] + ")O", // 2-(1,3-benzodioxol-5-yl)acetic acid C1OC2=C(O1)C=C(C=C2)CC(=O)O
            "O=C(" + functionalGroups.ketone[2] + ")O" // acetic acid CC(=O)O
        ]

        //console.log('CanonicalSmilesParserV2 carboxylicAcidToKetoneReverse()')
        // console.log(functionalGroups.ketone)
        //console.log(SMILES_arr)

        /*
        [ 'O', 'CC1=CC2=C(C=C1)OCO2', 'C' ]
[ 'O=C(CC1=CC2=C(C=C1)OCO2)O', 'O=C(C)O' ]

         */

        const reagents_arr =
            [
                "O(C(=O)" + functionalGroups.ketone[2] + ")C(=O)" + functionalGroups.ketone[2],
                "O(C(=O)" + functionalGroups.ketone[1] + ")C(=O)" + functionalGroups.ketone[1]
            ]

//        process.exit();


        SMILES_arr.map(

            (SMILES, i) => {
                MoleculeLookup(db, SMILES, "SMILES", true, "carboxylicAcidToKetoneReverse", lookup_err).then(
                    (substrate) => {
                        callback?callback(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents.indexOf('acyclic carboxylic anhydride')>-1?
                                [reagents_arr[i]]:rule.reagents,
                            child_reaction_as_string,
                            "carboxylicAcidToKetoneReverse"
                        ):render(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents,
                            child_reaction_as_string,
                            "carboxylicAcidToKetoneReverse"
                        )

                    },
                    (err) => {
                        lookup_err(err)
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
