const MoleculeLookup = require('../../lib/MoleculeLookup')

const PermangateOxidation = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {

    const reaction = (alkene_molecule, callback) => {

        if (true) {
            console.log('calling Permanganate oxidation')
        }

        const lookup_err = (err) => {
            console.log('Permanganate oxidation. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        const alkene_pairs = FunctionalGroups(alkene_molecule).functionalGroups.alkene

        alkene_pairs.map(
            (alkene_pair) => {
                MoleculeLookup(db, alkene_pair[0] + "O", "SMILES", true, "permanganateOxidation",   null).then(
                    (mol) => {
                        callback(mol)
                    },
                    (err) => {
                    }
                )
                MoleculeLookup(db, "O" + alkene_pair[1], "SMILES", true, "Permanganate oxidation",   null).then(
                    (mol) => {
                        callback(mol)
                    },
                    (err) => {
                    }
                )
            }
        )

    }

    const reverse = (callback) => {

        if (false) {
            console.log('calling Permanganate oxidation revrese')
        }

        const lookup_err = (err) => {
            console.log('Permanganate oxidation reverse. Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
        Functional groups
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
     alkene: [ [Array], [Array] ] },
         */
        MoleculeLookup(db, "C(=C.*)(" + molecule_json_object.functionalGroups.ketone[2] +")" + "(" + molecule_json_object.functionalGroups.ketone[1] + ")", "SMILES", true, "Permanganate oxidation reverse", lookup_err).then(
            (substrates) => {
                substrates.map(
                    (substrate) => {
                        this.reaction(molecule_json_object, (mol)=> {
                                if (mol.CanonicalSMILES === molecule_json_object.CanonicalSMILES) {

                                    callback ? callback(
                                        rule,
                                        molecule_json_object,
                                        substrate,
                                        rule.reagents,
                                        child_reaction_as_string,
                                        "Permanganate oxidation reverse"
                                    ) : render(
                                        rule,
                                        molecule_json_object,
                                        substrate,
                                        rule.reagents,
                                        child_reaction_as_string,
                                        "Permanganate oxidation reverse"
                                    )
                                }
                            }
                        )

                    }
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

module.exports = PermangateOxidation
