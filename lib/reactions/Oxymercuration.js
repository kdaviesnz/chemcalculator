const Oxymercuration = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse = (callback)  => {

        if (false) {
            console.log('calling oxymercurationReverse()')
        }

        const lookup_err = (err) => {
            console.log('oxymercurationReverse() Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // (rule, canonical_SMILES, substrate_JSON_object, reagents)
        MoleculeLookup(db, "C#C" + molecule_json_object.functionalGroups.ketone[1], "SMILES", true, "oxymercurationReverse()", false).then(
            (substrate) => {
                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "oxymercurationReverse()"
                ):render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "oxymercurationReverse()"
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

module.exports = Oxymercuration

