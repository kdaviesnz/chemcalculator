require("dotenv").config()
const should = require('should');
const Synthesize = require('../lib/Synthesize')

const SynthesizeTest = () => {

    const verbose = true


// Methyl piperonyl ketone
    // propylene glycol 1,2-propanediol CC(CO)O
    // isosafrole glycole
    const search = "isosafrole glycol"

    const render = (rule, molecule_JSON_object,substrate_JSON_object, reagents, child_reaction_as_string, debug )=>{

        console.log("Debug: " + debug)
        console.log("Mechanism: " + rule.mechanism)

        /*
        const s = reactions.filter(
            (reaction) => {
                return reaction.molecule_JSON_object.CanonicolSmiles === molecule_JSON_object.CanonicolSmiles
            }
        )

         */

      //  console.log("Substrate:")
      //  console.log(substrate_JSON_object)
        console.log("Links:"+rule.links)
        console.log("Catalyst:" + rule.catalyst)
        console.log("Reagents:" + reagents)

        if (true) {

            /*
            reactions.push(
                {
                    rule:rule,
                    molecule_JSON_object:molecule_JSON_object,
                    substrate_JSON_object:substrate_JSON_object,
                    reagents: reagents
                }
            )
             */
            /*  console.log(reactions.map(
                  (reaction) => {
                      return reaction.substrate_JSON_object.IUPACName
                  }
              ))
   */
            /*
            [ '3-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol',
  '1-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol',
  '5-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol',
  '6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol',
  'N-[1-(1,3-benzodioxol-5-yl)propan-2-yl]-N-methylhydroxylamine',
  '3-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol',
  '1-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol',
  '6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol',
  '6-[2-(methylamino)propyl]-1,3-benzodioxol-5-ol',
  '5-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol',
  '6-[2-(methylamino)propyl]-1,3-benzodioxol-5-ol',
  'N-[1-(1,3-benzodioxol-5-yl)propan-2-yl]-N-methylhydroxylamine' ]

             */
            /*
            ——— REACTION START ——-
 -->N-[1-(1,3-benzodioxol-5-yl)propan-2-yl]-N-methylhydroxylamine reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->6-[2-(methylamino)propyl]-1,3-benzodioxol-5-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->5-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->6-[2-(methylamino)propyl]-1,3-benzodioxol-5-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->1-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->3-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->N-[1-(1,3-benzodioxol-5-yl)propan-2-yl]-N-methylhydroxylamine reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->5-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->1-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  -->3-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol reagents [HI] —->1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine *  *  *  *  *  *  *  *  *  *  *  *  *
 ——— REACTION END ——-

             */
/*
            const reaction_as_string = reactions.reduce(
                (reaction_string, reaction) => {
                    return " -->" + substrate_JSON_object.IUPACName
                        + " reagents ["  + reagents + "] —->"
                        + molecule_JSON_object.IUPACName
                        + " * " + reaction_string + " * "
                },
                ""
            )

 */
            const reaction_as_string = " --> (IUPAC name) " + substrate_JSON_object.IUPACName + " ( (Smiles) " + substrate_JSON_object.CanonicalSMILES + ") "
                + " reagents ["  + reagents + "] —-> [IUPAC name]"
                + molecule_JSON_object.IUPACName + " ( [Smiles] " + molecule_JSON_object.CanonicalSMILES + ") "
                + " --> Child reaction:" + child_reaction_as_string
            console.log(reaction_as_string)
            console.log("")

          //  process.exit()

            // Add delay
          //  console.log('Delaying one second ...')
            /*
            setTimeout(function() {
            }, Math.floor(Math.random() * 5000))
            /*

            Synthesize(verbose, substrate_JSON_object.CanonicalSMILES, 'SMILES', reaction_as_string, render, (err)=> {
                console.log('SynthesisTest - there was an error')
                console.log(err)
                console.log(search)
            })
            */





        }
    }

    Synthesize(verbose, search, 'name', "||", render, (err)=> {
        console.log(search)
        console.log('There was an error - SynthesisTest.js')
        //process.exit()
    })






}

// module.exports = SynthesizeTest
SynthesizeTest()







