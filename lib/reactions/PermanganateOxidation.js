const PermangateOxidation = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reverse = (callback) => {

        if (false) {
            console.log('calling PermangateOxidation()')
        }

        const lookup_err = (err) => {
            console.log('PermangateOxidation() reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

     
        MoleculeLookup(db,
            "C=C" +
            molecule.functionalGroups.ketone.filter(
            (SMILES) => {
                return SMILES !== "C"
            }
            ).pop(),

            "SMILES", true, "PermangateOxidation reverse", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "PermangateOxidation reverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "PermangateOxidation reverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }


}

module.exports = PermangateOxidation
