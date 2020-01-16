const RulesLookup = require('./RulesLookup')
const FindSubstrates = require('./FindSubstrates')

const FetchReactions = (verbose,  db, chemical_to_synthesise_JSON_object, child_reaction_string, render, Err) => {

    /*
    Get the functional groups that the chemical we are trying to synthesise belongs to. Then
    for each functional group do a rules lookup to determine the reactions that result in
    the chemical we are trying to synthesise.
    */
    chemical_to_synthesise_JSON_object.functional_groups.map(
        // [secondary amine,benzene], [ketone], [1,2 Diol]
        (functional_group) => {

            RulesLookup(db, functional_group).then(
                (rules) => {
                    rules.map(
                        (rule) => {


                            //console.log('FetchReactions.js')
                            //console.log(rule)
                            //process.exit()

                            // Find the substrates that when the reaction steps are applied, will result in
                            // the end product and render results
                            FindSubstrates(
                                verbose,
                                db,
                                rule,
                                chemical_to_synthesise_JSON_object,
                                child_reaction_string,
                                render,
                                (err) => {
                                    console.log("Error finding substrates for " + chemical_to_synthesise_JSON_object.IUPACName)
                                    Err(err)
                                }
                            ) // FindSubstrates()

                        }
                    ) // rules.map
                }, // RulesLookup() success callback
                (Err) => {
                    console.log("Could not fetch rules where product is a " + functional_group)
                    Err(err)
                }
            ) // RulesLookup
        })

}

module.exports = FetchReactions








