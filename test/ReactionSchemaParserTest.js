const should = require('should');
const ReactionSchemaParser = require('../lib/ReactionSchemaParser')
const VerifyHydrohalogenationReaction = require('./VerifyHydrohalogenationReaction')
const Nomenclature = require('../lib/Nomenclature')

const ReactionSchemaParserTest = () => {

    // 2-methyl-2-butene -> HCl
    let schema = "2-chloro-3-methylbutane /"

    ReactionSchemaParser(schema, (err, reaction)=> {
        if (err) {
            console.log("Error doing reaction")
            console.log(err)
            process.exit()
        }
        console.log("Reaction done")
        VerifyHydrohalogenationReaction(reaction)

        /*
        Nomenclature.should.be.a.Function()
        console.log(reaction.products.length)
        const nom = Nomenclature(reaction.products[0])
        console.log(nom.determineName())
         */

    })



}

module.exports = ReactionSchemaParserTest