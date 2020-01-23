

const NagaiMethod = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (callback) => {

    }

    const reverse  = (callback) =>{
        if (false) {
            console.log('calling NagaiMethod reverse')
        }

        const lookup_err = (err) => {
            // CC(CC1=CC=CC=C1)NC ->  CC(CC(O)1=CC=CC=C1)NC
            console.log('NagaiMethod reverse. Error looking up substrate')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        const r = range.range(1, molecule_json_object.CanonicalSMILES.length)
        r.map(
            (i) => {
                const S = molecule_json_object.CanonicalSMILES.substr(0, i) + "(O)" + molecule_json_object.CanonicalSMILES.substr(i)

                MoleculeLookup(db, S, "SMILES", true, "nagaiMethodReverse", null).then(
                    (substrate) => {
                        callback?
                            callback(
                                rule,
                                molecule_json_object,
                                substrate,
                                rule.reagents,
                                child_reaction_as_string,
                                "NagaiMethod reverse"
                            ):
                            render(
                                rule,
                                molecule_json_object,
                                substrate,
                                rule.reagents,
                                child_reaction_as_string,
                                "NagaiMethod reverse"
                            )
                    },
                    (err) => {
                        lookup_err(err, 'NagaiMethod reverse. Error looking up substrate')
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

module.exports = NagaiMethod
