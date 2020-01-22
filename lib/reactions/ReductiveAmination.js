

const ReductiveAmination = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse = (callback)=>{

        //  process.exit()

        if (false) {
            console.log('calling reductiveAminationReverse()')
        }

        const lookup_err = (err) => {
            console.log('reductiveAminationReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


//return canonical_SMILES.replace("NC","(=O)")
//const aldehyde_SMILES = canonical_SMILES.replace("NC","(=O)")
// Verify we have an aldehyde
//const p = CanonicalSMILESParserV2(aldehyde_SMILES, db, rule, render  )
        if (undefined===rule.reagents) {
            rule.reagents = []
        }
        //rule.reagents.delete("NR")

        //CC(CC1=CC2=C(C=C1)OCO2)NC (MDMA)


// amine[1]  C(C)(CC1=CC2=C(C=C1)OCO2)
//  "O="+functionalGroups.secondary_amine[1],
        //   O=C(C)(CC1=CC2=C(C=C1)OCO2) (Methyl piperonyl ketone)



// aldehyde or ketone O=C(C)(CC1=CC2=C(C=C1)OCO2) (Methyl piperonyl ketone)


// nitrogen reagent N(C)

// 1. Replace O with nitrogen reagent
// O=C(C)(CC1=CC2=C(C=C1)OCO2)
//N(C)=C(C)(CC1=CC2=C(C=C1)OCO2)
// 2. Remove C=N double bond
//N(C)C(C)(CC1=CC2=C(C=C1)OCO2) (MDMA)

// aldehyde or ketone O=C(C)

// amine[2]  C(C)(CC1=CC2=C(C=C1)OCO2)
// nitrogen reagent N(C(C)(CC1=CC2=C(C=C1)OCO2))




        //   MDMA

// 1. Replace O with nitrogen reagent
// O=C
// amine[2]  C(C)(CC1=CC2=C(C=C1)OCO2)
// N(C(C)(CC1=CC2=C(C=C1)OCO2))
// 2. Remove C=N double bond
        //   N(C(C)(CC1=CC2=C(C=C1)OCO2))C



// amine[1]  C(C)(CC1=CC2=C(C=C1)OCO2)
// amine[2] C

        const secondary_amine_minus_hydrogen = functionalGroups.secondary_amine.filter(
            (branch) => {
                return branch !== "H"
            }
        )

        // [ 'N', 'CC(CC1=CC2=C(C=C1)OCO2)', 'C' ]

        // 3,4-methylenedioxyphenyl-2-propanone MDP2P  CC(=O)CC1=CC2=C(C=C1)OCO2


//  [ 'N', 'H', 'C(CC1=CC2=C(C=C1)OCO2)', 'C' ]
// CC(CC1=CC2=C(C=C1)OCO2)NC
// CC(CC1=CC2=C(C=C1)OCO2)NC - secondary

// CC(CC1=CC2=C(C=C1)OCO2)NCl

// CC(CC1=CC2=C(C=C1)OCO2)NC
// CC(CC1=CC2=C(C=C1)OCO2)N
// CC(CC1=CC2=C(C=C1)OCO2)=O




// CC(=O)CC1=CC2=C(C=C1)OCO2 - ketone






// CC(=O)CC1=CC2=C(C=C1)OCO2
// CC(=N(C))CC1=CC2=C(C=C1)OCO2


        const y = molecule_json_object.CanonicalSMILES.match(/N.*/)
// CC(CC1=CC2=C(C=C1)OCO2)NC - secondary —> CC(CC1=CC2=C(C=C1)OCO2)=O

        const x = molecule_json_object.CanonicalSMILES.match(/(.*N)/)
// CC(CC1=CC2=C(C=C1)OCO2)NC - secondary —> O=C

        const y_reagents = rule.reagents
        y_reagents.push(y[0])

        // process.exit()

        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace(y[0], "=O"), "SMILES", true, "reductiveAminationReverse", lookup_err).then(
            (substrate) => {
                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    y_reagents,
                    child_reaction_as_string,
                    "reductiveAminationReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        y_reagents,
                        child_reaction_as_string,
                        "reductiveAminationReverse() A"
                    )
            },
            (err) => {
                console.log('There was an error')
                lookup_err(err)
            }
        )


        const x_reagents = rule.reagents

        x_reagents.push(x[0])


        // should be O=C
        /*
        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace(x[0], "O="), 'SMILES', true, lookup_err).then(
            (substrate) => {
                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate + 'xxx',
                    x_reagents,
                    child_reaction_as_string
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        x_reagents,
                        child_reaction_as_string,
                        "reductiveAminationReverse() B"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )
        */
    }



    return {
        reaction: reaction,
        reverse: reverse
    }

}

module.exports = ReductiveAmination
