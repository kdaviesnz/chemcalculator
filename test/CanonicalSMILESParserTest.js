require("dotenv").load()
// process.env.MONGODBPASSWORD


const should = require('should');
const CanonicalSMILESParserV2 = require('../lib/CanonicalSMILESParserV2')
const MoleculeLookup = require('../lib/MoleculeLookup')


const runTest = (functional_group, test_name, SMILES, db, expected_results, callback) => {

    console.log('VERIFYING ' + test_name)

    // Epoxide  parser.functionalGroups.epoxide.should.be.a.Array() -> false
// const epoxide_SMILES = 'CC1(C(O1)(C)C)C'
// 2,2,3,3-tetramethyloxirane
// CC1(C(O1)(C)C)C




    // carboxylic salt tests parser.functionalGroups.ketone[0].should.be.equal(expected_results.ketone[0]) ->  expected 'OC' to be 'CC
// const canonical_SMILES = 'CC(=O)OC'
// methyl acetate
// CC(=O)OC




    // methyl ketone test parser.functionalGroups.ketone[0].should.be.equal(expected_results.ketone[0]) - expected 'C' to be 'CC'
// const methyl_ketone_SMILES = 'CCC(=O)C'
// butan-2-one
// CCC(=O)C




    // amide tests parser.functionalGroups.ketone[1].should.be.equal(expected_results.ketone[1]) - expected 'NC1=CC=C(C=C1)O' to be 'CC'
// const amide_SMILES = 'CC(=O)NC1=CC=C(C=C1)O'
// N-(4-hydroxyphenyl)acetamide
// CC(=O)NC1=CC=C(C=C1)O



// primary alcohol tests - parser.functionalGroups.alcohol.should.be.a.Array() - expected false to be an array
// const primary_alcohol_SMILES = 'CC(O)'
// ethanol
// CCO




// glycol tests - parser.functionalGroups.alcohol.should.be.a.Array() - expected false to be an array
//  const glycol_SMILES = 'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
// 1-(1,3-benzodioxol-5-yl)propane-1,2-diol
// CC(C(C1=CC2=C(C=C1)OCO2)O)O




// aromatic hydrocarbon tests - ok
    // akyl halide tests - ok


    // carboxylic acid tests - parser.functionalGroups.ketone[1].should.be.equal(expected_results.ketone[1]) - expected 'C1OC2=C(O1)C=C(C=C2)CO' to be 'C1OC2=C(O1)C=C(C=C2)COC'
// const carboxylic_acid_SMILES = 'C1OC2=C(O1)C=C(C=C2)COC=O'
// 1,3-benzodioxol-5-ylmethyl formate
// C1OC2=C(O1)C=C(C=C2)COC=O






// ketone - wild card error when looking up pubchem * should be .*


// primary amine Unable to standardize the given structure - CC(CC1=CC2=C(C=C1)OCO2)At


    // secondary amine Unable to standardize the given structure  CC(CC1=CC2=(O)C(C=C1)OCO2)NC, CC(CC1=CC2=C(O)(C=C1)OCO2)NC, CC((O)CC1=CC2=C(C=C1)OCO2)NC, CC(CC1=CC2=C(C=C1)(O)OCO2)NC, CC(CC(O)1=CC2=C(C=C1)OCO2)NC, CC(CC1(O)=CC2=C(C=C1)OCO2)NC,  CC(CC1=(O)CC2=C(C=C1)OCO2)NC,
 //   CC(CC1=CC2=C(C=C1)OCO2(O))NC
// tertiary amine - ok



    MoleculeLookup(db, SMILES, 'SMILES', true).then(
        (molecule_JSON_object) => {
            console.log("[" + functional_group + "] " + molecule_JSON_object.IUPACName)
            const parser = CanonicalSMILESParserV2(
                molecule_JSON_object,
                db,
                {},
                (canonical_SMILES, substrate_JSON_object, reagents) => {
                }
            )

            if (expected_results.ketone===false){
                parser.functionalGroups.ketone.should.be.a.Boolean()
                parser.functionalGroups.ketone.should.be.false
            }else {
                parser.functionalGroups.ketone.should.be.a.Array()
                parser.functionalGroups.ketone[0].should.be.equal(expected_results.ketone[0])
                parser.functionalGroups.ketone[1].should.be.equal(expected_results.ketone[1])
                parser.functionalGroups.ketone[2].should.be.equal(expected_results.ketone[2])
            }

            if (expected_results.amide===false){
                parser.functionalGroups.amide.should.be.a.Boolean()
                parser.functionalGroups.amide.should.be.false
            }else {
                parser.functionalGroups.amide.should.be.a.Array()
                parser.functionalGroups.amide[0].should.be.equal(expected_results.amide[0])
                parser.functionalGroups.amide[1].should.be.equal(expected_results.amide[1])
                parser.functionalGroups.amide[2].should.be.equal(expected_results.amide[2])
            }

            if (expected_results.ester===false){
                parser.functionalGroups.ester.should.be.a.Boolean()
                parser.functionalGroups.ester.should.be.false
            }else {
                parser.functionalGroups.ester.should.be.a.Array()
                parser.functionalGroups.ester[0].should.be.equal(expected_results.ester[0])
                parser.functionalGroups.ester[1].should.be.equal(expected_results.ester[1])
                parser.functionalGroups.ester[2].should.be.equal(expected_results.ester[2])
            }

            if (expected_results.epoxide===false){
                parser.functionalGroups.epoxide.should.be.a.Boolean()
                parser.functionalGroups.epoxide.should.be.false
            }else {
                parser.functionalGroups.epoxide.should.be.a.Array()
                parser.functionalGroups.epoxide[0].should.be.equal(expected_results.epoxide[0])
                parser.functionalGroups.epoxide[1].should.be.equal(expected_results.epoxide[1])
                parser.functionalGroups.epoxide[2].should.be.equal(expected_results.epoxide[2])
                parser.functionalGroups.epoxide[3].should.be.equal(expected_results.epoxide[3])
            }

            if (expected_results.aldehyde===false){
                parser.functionalGroups.aldehyde.should.be.a.Boolean()
                parser.functionalGroups.aldehyde.should.be.false
            }else {
                parser.functionalGroups.aldehyde.should.be.a.Array()
                parser.functionalGroups.aldehyde[0].should.be.equal(expected_results.aldehyde[0])
                parser.functionalGroups.aldehyde[1].should.be.equal(expected_results.aldehyde[1])
                parser.functionalGroups.aldehyde[2].should.be.equal(expected_results.aldehyde[2])
            }

            if (expected_results.glycol===false){
                parser.functionalGroups.glycol.should.be.a.Boolean()
                parser.functionalGroups.glycol.should.be.false
            }else {
                //parser.functionalGroups.glycol.should.be.a.Array()
                //parser.functionalGroups.glycol.should.be.equal(expected_results.glycol)
            }

            if (expected_results.alcohol===false){
                parser.functionalGroups.alcohol.should.be.a.Boolean()
                parser.functionalGroups.alcohol.should.be.false
            }else {
                parser.functionalGroups.alcohol.should.be.a.Array()
                parser.functionalGroups.alcohol[0].should.be.equal(expected_results.alcohol[0])
                parser.functionalGroups.alcohol[1].should.be.equal(expected_results.alcohol[1])
            }

            console.log('Passed VERIFICATION')
            callback(parser)


        },
        (Err) => {
            console.log("Error looking up " + SMILES)
        }
    )
}




const CanonicalSMILESParserV2Test = () => {

    // Connect to mongo database
    const MongoClient = require('mongodb').MongoClient
    const S = require('string');

    MongoClient.connect('mongodb+srv://' + process.env.MONGODBUSER + ':' + process.env.MONGODBPASSWORD + '!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true},
        function (err, client) {

            console.log('Connecting to MONGO')
            if (err) {
                console.log(err)
                process.exit()
            }
            const db = client.db('chemistry');


            // CARBOXYLIC SALT TESTS START * —————————
            if (false) {
                // Methyl acetate
                const canonical_SMILES = 'CC(=O)OC'
                runTest('carboxylic salt', 'carboxlic salt tests', canonical_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: ['O', 'C', 'OC'],
                        amide: false,
                        ketone: ['O', 'OC', 'C']
                    },
                    (parser) => {
                        parser.replaceORGroupOnCarboxylCarbonWithOCation((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling replaceORGroupOnCarboxylCarbonWithOCation() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
// functionalGroups.ester[1]+ "C(=O)[OH+]"

                                //                   substrate.CanonicalSMILES.should.be.equal('CC(=O)[OH2+]')
                                substrate.IUPACName.should.be.equal('propanoate')
                                console.log('replaceORGroupOnCarboxylCarbonWithOCation() test passed')

                            }
                        )
                    }
                )
            }
            // CARBOXYLIC SALT TESTS END —————————

            if (false) {

                // METHYL KETONE  TESTS START ————————— *
                const methyl_ketone_SMILES = 'CCC(=O)C'
                runTest('methyl ketone', 'methyl ketone tests', methyl_ketone_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: ['O', 'C', 'CC']
                    },
                    (parser) => {
                        parser.wackerOxidationReverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                                console.log('Calling wackerOxidationReverse () callback')
                                // (node:1677) UnhandledPromiseRejectionWarning: AssertionError: expected 'CCCC(=C)C' to be 'CCC(=C)C'
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.equal('CCC(=C)C')
                                substrate.IUPACName.should.be.equal('2-methylbut-1-ene')
                                console.log('wackerOxidationReverse() test passed')

                            }
                        )
                    }
                )
                // METHYL KETONE TESTS END —————————
            }

            if (false) {

                // AMIDE  TESTS START —————————
                // paracetamol

                const amide_SMILES = 'CC(=O)NC1=CC=C(C=C1)O'
                runTest('amide', 'amide tests', amide_SMILES, db,
                    {
                        alcohol: ['OH', 'CC(=O)NC1=CC=C(C=C1)'],
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: ['O', 'C', 'NC1=CC=C(C=C1)O'],
                        amide: ['O', 'C', 'NC1=CC=C(C=C1)O'],
                        ketone: ['O', 'NC1=CC=C(C=C1)O', 'C']
                    },
                    (parser) => {
                        parser.ritterReactionReverse((rule, canonical_SMILES, substrate, reagents) => {
//     "*C=" + N_Branch.substr(1),
                                //  C=C1=CC=C(C=C1)O
                                console.log('Calling ritterReactionReverse() callback')

                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.equal('CC(CC1=CC2=C(C=C1)OCO2)C=O')
                                substrate.IUPACName.should.be.equal('3-(1,3-benzodioxol-5-yl)-2-methylpropanal')
                                console.log('ritterReactionReverse() passed')




                            }
                        )
                    }
                )
                // AMIDE TESTS END —————————
            }

            if (false) {

                // EPOXIDE  TESTS START —————————
                const epoxide_SMILES = 'CC1(C(O1)(C)C)C'

                runTest('epoxide', 'epoxide tests', epoxide_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: ["O", "C", "C", "C", "C"],
                        ester: false,
                        amide: false,
                        ketone: false
                    },
                    (parser) => {
                        parser.replaceEpoxideOxygenWithDoubleBond((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
// functionalGroups.epoxide[1] + "C(" + functionalGroups.epoxide[2]  + ")=C(" + functionalGroups.epoxide[3] + ")" + functionalGroups.epoxide[4],
// CC(C)=C(C)C

                                console.log('Calling replaceEpoxideOxygenWithDoubleBond() callback')
                                MoleculeLookup(db, substrate, true).then(
                                    (substrates) => {

                                        substrate.CanonicalSMILES.should.be.a.String()
                                        substrate.CanonicalSMILES.should.be.equal('CC(=C(C)C)C')
                                        substrate.IUPACName.should.be.equal('2,3-dimethylbut-2-ene')
                                        console.log('replaceEpoxideOxygenWithDoubleBond() passed')


                                    }
                                )
                            }
                        )
                    }
                )
                // EPOXIDE TESTS END —————————

            }

            if (false) {

                // PRIMARY ALCOHOL TESTS START —————————
                // ethanol CCO
                const primary_alcohol_SMILES = 'CC(O)'
                runTest('primary alcohol', 'primary alcohol tests', primary_alcohol_SMILES, db,
                    {
                        alcohol: ['OH', 'CC'],
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false
                    },
                    (parser) => {
                        parser.esterToAlcoholReverse((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling esterToAlcoholReverse() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                //               functionalGroups.alcohol[1]  + "C(=O)O.*"             substrate.CanonicalSMILES.should.be.equal('CC(=O)ON')
                                substrate.IUPACName.should.be.equal('propanoic acid')
                                console.log("esterToAlcoholReverse() test passed")


                            }
                        )
                    }
                )
                // PRIMARY ALCOHOL TESTS END —————————

            }

            if (false) {

                // GLYCOL TESTS START —————————
                const glycol_SMILES = 'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
                // Isosafrole glycol

                runTest('glycol', 'glycol tests', glycol_SMILES, db,
                    {
                        alcohol: false,
                        glycol: [],
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false
                    },
                    (parser) => {
                        parser.mashCarboxylGroupsIntoAnEpoxideRing((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling mashCarboxylGroupsIntoAnEpoxideRing() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.equal('CC1C(O1)C2=CC3=C(C=C2)OCO3')
                                substrate.IUPACName.should.be.equal('5-(3-methyloxiran-2-yl)-1,3-benzodioxole')


                            }
                        )
                    }
                )
                // GLYCOL TESTS END —————————

            }

            if (false) {

                // AROMATIC HYDROCARBON TESTS START —————————
                const aromatic_hydrocarbon_SMILES = 'CC(C(C1=CC=CC=C1))NC'
                /*
                chloroephedrine
                CC(C(C1=CC=CC=C1)Cl)NC

                */
                runTest('aromatic hydrocarbon', 'aromatic hydrocarbon tests', aromatic_hydrocarbon_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false
                    },
                    (parser) => {
                        parser.replaceHydrogenWithHalideReverse((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling replaceHydrogenWithHalideReverse() callback')
                                substrate.CanonicalSMILES.should.be.a.String()


                                console.log('replaceHydrogenWithHalideReverse() tests passed')


                            }
                        )


                    }
                )
                // AROMATIC HYDROCARBON TESTS END —————————

            }

            if (false) {


                // AKYL HALIDE TESTS START —————————
                const akyl_halide_SMILES = 'CCl'
                runTest('akyl halide', 'akyl halide tests', akyl_halide_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false
                    },
                    (parser) => {
                        parser.replaceSingleAtom("Cl", "(O)", (rule, canonical_SMILES, substrate) => {
                            console.log('Calling replaceSingleAtom() callback')
                            substrate.CanonicalSMILES.should.be.a.String()
                            substrate.CanonicalSMILES.should.be.equal('CO')
                            substrate.IUPACName.should.be.equal('methanol')
                            console.log('akyl halide tests passed')


                        })

                    }
                )
            }
            // AKYL HALIDE  TESTS END —————————


            if (false) {


                // BENZYL ALCOHOL TESTS START —————————
                const benzyl_alcohol_SMILES = 'C1=CC=C(C=C1)CO'
                // BENZYL ALCOHOL TESTS END —————————

            }

            if (false) {


                // CARBOXYLIC ACID TESTS START —————————
                const carboxylic_acid_SMILES = 'C1OC2=C(O1)C=C(C=C2)COC=O'
                // piperonyl formate

                runTest('carboxylic acid', 'carboxylic acid tests', carboxylic_acid_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: ['O', 'C1OC2=C(O1)C=C(C=C2)CO', 'H']
                    },
                    (parser) => {

                        parser.revertSplitGlycolBackToWhole((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling revertSplitGlycolBackToWhole() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.equal('CC(CC1=CC2=C(C=C1)OCO2)C=O')
                                substrate.IUPACName.should.be.equal('3-(1,3-benzodioxol-5-yl)-2-methylpropanal')



                            }
                        )

                        parser.replaceORGroupOnCarboxylCarbonWithOH((rule, canonical_SMILES, substrate, reagents) => {

                                console.log('Calling replaceORGroupOnCarboxylCarbonWithOH() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.equal('C1OC2=C(O1)C=C(C=C2)COC(=O)O')
                                substrate.IUPACName.should.be.equal('1,3-benzodioxol-5-ylmethyl hydrogen carbonate')


                            }
                        )
                    }
                )
                // CARBOXYLIC ACID TESTS END —————————

            }

            if (false) {

                // KETONE TESTS START —————————
                const ketone_SMILES = 'CC(=O)CC1=CC2=C(C=C1)OCO2'  // MDP2P

                runTest('ketone', 'ketone tests', ketone_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: ['O', 'CC1=CC2=C(C=C1)OCO2', 'C']
                    },
                    (parser) => {
                        if (false) {
                            parser.revertSplitGlycolBackToWhole((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                                    console.log('Calling revertSplitGlycolBackToWhole() callback')
                                    MoleculeLookup(db, substrate_JSON_object, true).then(
                                        (substrate) => {
                                            substrate.CanonicalSMILES.should.be.a.String()
                                            substrate.CanonicalSMILES.should.be.equal('CC(CC1=CC2=C(C=C1)OCO2)C=O')
                                            substrate.IUPACName.should.be.equal('3-(1,3-benzodioxol-5-yl)-2-methylpropanal')


                                        },
                                        (Err) => {
                                            console.log('Error getting substrate')
                                            process.exit()
                                        }
                                    )
                                }
                            )
                        }

                        if (false) {
                            parser.carboxylicAcidToKetoneReverse((rule, molecule, substrate, reagents) => {
                                console.log('Calling carboxylicAcidToKetoneReverse() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.oneOf([
                                    'C1OC2=C(O1)C=C(C=C2)CC(=O)O',
                                    'CC(=O)O'
                                ])

                                substrate.IUPACName.should.be.oneOf([
                                    '3-(1,3-benzodioxol-5-yl)-2-methylpropanal',
                                    '2-(1,3-benzodioxol-5-yl)acetic acid',
                                    'acetic acid'
                                ])

                                console.log('carboxylicAcidToKetoneReverse() test passed')

                            })
                        }

                        if (false) {
                            parser.pinacolRearrangemenReverse((rule, canonical_SMILES, substrate_JSON_object, reagents) => {
                                    console.log('Calling pinacolRearrangement() callback ' + canonical_SMILES)
                                    console.log(substrate_JSON_object)
                                    substrate.CanonicalSMILES.should.be.a.String()
                                    substrate.CanonicalSMILES.should.be.equal('CC(C(C1=CC2=C(C=C1)OCO2)O)O')
                                    substrate.IUPACName.should.be.equal('1-(1,3-benzodioxol-5-yl)propane-1,2-diol')
                                console.log('pinacolRearrangement() test passed')
                                }
                            )
                        }

                        if (false) {
                            parser.replaceCarboxylOxygenWithCR((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling replaceCarboxylOxygenWithCR() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.oneOf(['C(=C)CC1=CC2=C(C=C1)OCO2'])
                                substrate.IUPACName.should.be.oneOf(['3-(1,3-benzodioxol-5-yl)-2-methylpropanal'])
                                console.log('replaceCarboxylOxygenWithCR() test passed')
                            })
                        }

                    }
                )
            }
// KETONE TESTS END —————————

            if (false) {

                //  PRIMARY AMINE TESTS START —————————
                const primary_amine_SMILES = 'CC(CC1=CC2=C(C=C1)OCO2)N'
                // piperonyl formate
                runTest('primary amine', 'primary amine tests', primary_amine_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false,
                        secondary_amine:[]
                    },
                    (parser) => {
// RETEST
                        parser.replaceHalideWithNH2Reverse((rule, canonical_SMILES, substrate, reagents) => {
                                console.log('Calling replaceHalideWithNH2Reverse() callback')
                                substrate.CanonicalSMILES.should.be.a.String()
                                substrate.CanonicalSMILES.should.be.oneOf(['CC(CC1=CC2=C(C=C1)OCO2)Cl', 'CC(CC1=CC2=C(C=C1)OCO2)Br'])
                                substrate.IUPACName.should.be.oneOf(['5-(2-chloropropyl)-1,3-benzodioxole', '5-(2-bromopropyl)-1,3-benzodioxole'])
                            }
                        )

                    }
                )
                // PRIMARY AMINE TESTS END —————————

            }

            if (true) {

                //  SECONDARY AMINE TESTS START —————————
                const secondary_amine_SMILES = 'CC(CC1=CC2=C(C=C1)OCO2)NC'
                // MDMA
                runTest('secondary amine', 'secondary amine tests', secondary_amine_SMILES, db,
                    {
                        alcohol: false,
                        glycol: false,
                        aldehyde: false,
                        epoxide: false,
                        ester: false,
                        amide: false,
                        ketone: false,
                        secondary_amine: ['N', 'C(CC1=CC2=C(C=C1)OCO2)', 'C' ],
                    },
                    (parser) => {

// WORKING
                        if (true) {
                            parser.reductiveAminationReverse((rule, canonical_SMILES, substrate, reagents) => {
                                    substrate.CanonicalSMILES.should.be.a.String()
                                    substrate.CanonicalSMILES.should.be.oneOf(['C=O', 'CC(=O)CC1=CC2=C(C=C1)OCO2'])
                                    substrate.IUPACName.should.be.be.oneOf(['formaldehyde', '1-(1,3-benzodioxol-5-yl)propan-2-one', '3-(1,3-benzodioxol-5-yl)propanal'])
                                console.log("reductiveAmination() test passed")
                                }
                            )
                        }

// RETEST

                        if (false) {
                            parser.replaceHalideWithNCReverse
                            ((rule, canonical_SMILES, substrate, reagents) => {
                                    console.log('Calling replaceHalideWithNCReverse() callback')
// 'CC(CC1=CC2=C(C=C1)OCO2)NC'
                                    substrate.CanonicalSMILES.should.be.a.String()
                                    substrate.CanonicalSMILES.should.be.oneOf(['CC(CC1=CC2=C(C=C1)OCO2)Br', 'CC(CC1=CC2=C(C=C1)OCO2)Cl'])
                                    substrate.IUPACName.should.be.oneOf(['5-(2-bromopropyl)-1,3-benzodioxole', '5-(2-chloropropyl)-1,3-benzodioxole'])

                                    console.log("replaceHalideWithNCReverse() test passed")

                                }
                            )

                        }

                        if (false) {
                            parser.nagaiMethodReverse((rule, canonical_SMILES, substrate, reagents) => {
                                    console.log('Calling nagaiMethodReverse() callback')
                                    substrate.CanonicalSMILES.should.be.a.String()
                                    /*
                                    AssertionError: expected 'CC(C(C1=CC2=C(C=C1)OCO2)O)NC' to be one of Array [
                                     'CC(C(O)C1=CC2=C(C=C1)OCO2)NC',
                                     'CC(CC1=C(O)C2=C(C=C1)OCO2)NC',
                                     'CC(CC1=CC2=C(C(O)=C1)OCO2)NC',
                                     'CC(CC1=CC2=C(C=C1(O))OCO2)NC'

                                    */
                                    substrate.CanonicalSMILES.should.be.oneOf(['CC(CC1=CC(=C2C(=C1)OCO2)O)NC','CC(CC1=CC2=C(C=C1O)OCO2)NC', 'CC(CC1=C(C2=C(C=C1)OCO2)O)NC', 'CNC(CC1=CC2=C(C=C1)OCO2)CO', 'CC(CC1=CC2=C(C=C1)OCO2)N(C)O', 'CC(C(O)C1=CC2=C(C=C1)OCO2)NC', 'CC(CC1=C(O)C2=C(C=C1)OCO2)NC', 'CC(CC1=CC2=C(C(O)=C1)OCO2)NC', 'CC(CC1=CC2=C(C=C1(O))OCO2)NC'])
                                    substrate.IUPACName.should.be.oneOf(['3-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol','N-[1-(1,3-benzodioxol-5-yl)propan-2-yl]-N-methylhydroxylamine','1-(1,3-benzodioxol-5-yl)-2-(methylamino)propan-1-ol', '5-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol', '6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol', '6-[2-(methylamino)propyl]-1,3-benzodioxol-4-ol', '6-[2-(methylamino)propyl]-1,3-benzodioxol-5-ol'])

                                    console.log("nagaiMethodReverse() test passed")
                                }
                            )

                        }
                    }
                )


// SECONDARY AMINE TESTS END —————————
                if (false) {

//  TERTIARY AMINETESTS START —————————
                    const tertiary_amine_SMILES = 'CC(CC1=CC2=C(C=C1)OCO2)N(C)C'
// piperonyl formate
                    runTest('tertiary amine', 'tertiary amine tests', tertiary_amine_SMILES, db,
                        {
                            alcohol: false,
                            glycol: false,
                            aldehyde: false,
                            epoxide: false,
                            ester: false,
                            amide: false,
                            ketone: false
                        },
                        (parser) => {

                        }
                    )
                    // TERTIARY AMINE TESTS END —————————
                }
            }
        })
}

CanonicalSMILESParserV2Test()







