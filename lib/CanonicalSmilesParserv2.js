const FunctionalGroups = require('../lib/FunctionalGroups')
const range = require("range");
const MoleculeLookup = require('../lib/MoleculeLookup')

const CanonicalSMILESParserV2 = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {


    const functionalGroups = FunctionalGroups(molecule_json_object).functionalGroups

    const tertiaryAmineToHalogenalkane = (callback)  => {

        if (false) {
            console.log('calling tertiaryAmineToHalogenalkane()')
        }

        const lookup_err = (err) => {
            console.log('tertiaryAmineToHalogenalkane() Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        const halides = ["Cl", "Br", "[At]", "F", "I"]
        halides.map(
            (X)=>{
                // (rule, canonical_SMILES, substrate_JSON_object, reagents)
                MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("N", X), "SMILES", true, "tertiaryAmineToHalogenalkane", false).then(
                    (substrate) => {
                        callback?callback(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents,
                            child_reaction_as_string,
                            "tertiaryAmineToHalogenalkane"
                        ):render(
                            rule,
                            molecule_json_object,
                            substrate,
                            rule.reagents,
                            child_reaction_as_string,
                            "tertiaryAmineToHalogenalkane"
                        )
                    },
                    (err) => {
                        lookup_err(err)
                    }
                )

            }
        )

    }


    const mashCarboxylGroupsIntoAnEpoxideRing = (callback)=> {
        if (false) {
            console.log('calling mashCarboxylGroupsIntoAnEpoxideRing()')
        }

        const lookup_err = (err) => {
            console.log('mashCarboxylGroupsIntoAnEpoxideRing(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
 isosafrole glycol
 CC(C(C1=CC2=C(C=C1)OCO2)O)O (isosafrole glycol)
 CCOC(=O)C1(C(O1)C2=CC3=C(C=C2)OCO3)C (ethyl-PMK glycidate) epoxide
 [
 "C(CO)O",
 C,
 H,
 (C1=CC2=C(C=C1)OCO2),
 H
 ]
 CC1(H)OC1(C1=CC2=C(C=C1)OCO2)
 Isosafrole ozonide
 Isosafrole ozonide
 http://online.aurorafinechemicals.com/info?ID=A31.288.487

    const glycol_SMILES = 'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
                // Isosafrole glycol



            CC1()OC1(C1=CC2=C(C=C1)OCO2)
 CC1OC1(C1=CC2=C(C=C1)OCO2)
 5-(3-methyloxiran-2-yl)-1,3-benzodioxole
 CC1C(O1)C2=CC3=C(C=C2)OCO3

       */
        MoleculeLookup(db, (functionalGroups.glycol[1]
            + "C1("
            + functionalGroups.glycol[2]
            + ")OC1(" + functionalGroups.glycol[3]
            + ")"
            + functionalGroups.glycol[4]).replace(/\(\)/,""), "SMILES", true, "mashCarboxylGroupsIntoAnEpoxideRing", lookup_err).then(
            (substrate) => {

                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "mashCarboxylGroupsIntoAnEpoxideRing"
                ):render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "mashCarboxylGroupsIntoAnEpoxideRing"
                )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }


    const replaceSingleAtom = (atom, replacement, callback)  => {

        if (false) {
            console.log('calling replaceSingleAtom()')
        }

        const lookup_err = (err) => {
            console.log('replaceSingleAtom(). Error looking up substrate(s)')
            console.log('atom - ' + atom)
            console.log('replacement - ' + replacement)
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

// 'CCl' (O)
        // (rule, canonical_SMILES, substrate_JSON_object, reagents)
        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace(atom, replacement), "SMILES", true, "replaceSingleAtom", lookup_err).then(
            (substrate) => {

                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "replaceSingleAtom"
                ):render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "replaceSingleAtom"
                )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    const replaceCarboxylOxygenWithCarbon =  (callback) => {
        if (false) {
            console.log('calling replaceCarboxylOxygenWithCarbon()')
        }

        const lookup_err = (err) => {
            console.log('replaceCarboxylOxygenWithCarbon(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // ADD oxygen DOUBLE BOND TO terminal alkene ON MOST SUBSTITUTED carbon(do reverse of)
        //   const ester_parsed = FunctionalGroupParser("ester", canonical_SMILES)

        MoleculeLookup(db, functionalGroups.ester[1]+ "C=C",
            "SMILES", true, "replaceCarboxylOxygenWithCarbon", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceCarboxylOxygenWithCarbon"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceCarboxylOxygenWithCarbon"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    const replaceORGroupOnCarboxylCarbonWithOCation = (callback) => {
        if (false) {
            console.log('calling replaceORGroupOnCarboxylCarbonWithOCation()')
        }

        const lookup_err = (err) => {
            console.log('replaceORGroupOnCarboxylCarbonWithOCation(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        MoleculeLookup(db, functionalGroups.ester[1]+ "C(=O)[O-]",
            "SMILES", true, "replaceORGroupOnCarboxylCarbonWithOCation", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceORGroupOnCarboxylCarbonWithOCation"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceORGroupOnCarboxylCarbonWithOCation"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }


    const convertAlcoholToEster =  () => {
        if (false) {
            console.log('calling convertAlcoholToEster()')
        }

        const lookup_err = (err) => {
            console.log('convertAlcoholToEster(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        //const alcohol_parsed = FunctionalGroupParser("alcohol", SMILES)
        MoleculeLookup(db, functionalGroups.alcohol[1]  + "C(=O)OR",
            "SMILES", true, "convertAlcoholToEster", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "convertAlcoholToEster"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "convertAlcoholToEster"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )



    }



    const alcoholToEpoxide =  () => {
        if (false) {
            console.log('calling alcoholToEpoxide()')
        }

        const lookup_err = (err) => {
            console.log('alcoholToEpoxide(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // const alcohol_parsed = FunctionalGroupParser("alcohol", SMILES)

        MoleculeLookup(db, functionalGroups.ketone[1]+ "C(O)C(O)" + functionalGroups.ketone[2],
            "SMILES", true, "alcoholToEpoxide", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "alcoholToEpoxide"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "alcoholToEpoxide"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )


    }


    const replaceORGroupOnCarboxylCarbonWithOH = () => {
        if (false) {
            console.log('calling replaceORGroupOnCarboxylCarbonWithOH()')
        }

        const lookup_err = (err) => {
            console.log('replaceORGroupOnCarboxylCarbonWithOH(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
        return {
        "R1": ketone_parsed.R1.substr(0,1)==="O"?ketone_parsed.R2:ketone_parsed.R1,
        "Group":"C(=O)O",
        "R2":ketone_parsed.R1.substr(0,1)==="O"?ketone_parsed.R1.substr(1):ketone_parsed.R2
        }

 const carboxylic_acid_SMILES = 'C1OC2=C(O1)C=C(C=C2)COC=O'
                // piperonyl formate

                             ketone: ['O', 'C1OC2=C(O1)C=C(C=C2)COC', 'H']

 C1OC2=C(O1)C=C(C=C2)COC(=O)O

 C1OC2=C(O1)C=C(C=C2)COC(=O)O
 1,3-benzodioxol-5-ylmethyl hydrogen carbonate
        */
        MoleculeLookup(db, functionalGroups.ketone[1] + "(=O)O", "SMILES", true, "replaceORGroupOnCarboxylCarbonWithOH", lookup_err).then(
            (substrate) => {

                callback?callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "replaceORGroupOnCarboxylCarbonWithOH"
                ):render(
                    rule,
                    canonical_SMILES,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "replaceORGroupOnCarboxylCarbonWithOH"
                )

            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    const replaceHalideWithNH2Reverse = (callback) => {
        if (false) {
            console.log('calling replaceHalideWithNH2Reverse()')
        }

        const lookup_err = (err) => {
            console.log('replaceHalideWithNH2Reverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        const halides = ["Cl", "Br", "[At]", "F", "I"]
        halides.map(

            (X)=>{

                MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("N",X), "SMILES", true,  "replaceHalideWithNH2Reverse", lookup_err).then(
                    (substrate) => {
                        callback?
                            callback(
                                rule,
                                molecule_json_object,
                                substrate,
                                rule.reagents,
                                child_reaction_as_string,
                                "replaceHalideWithNH2Reverse"
                            ):
                            render(
                                rule,
                                molecule_json_object,
                                substrate,
                                rule.reagents,
                                child_reaction_as_string,
                                "replaceHalideWithNH2Reverse"
                            )
                    },
                    (err) => {
                        lookup_err(err)
                    }
                )
            }
        )
    }

    const replaceEpoxideOxygenWithDoubleBond = (callback) => {
        if (false) {
            console.log('calling replaceEpoxideOxygenWithDoubleBond()')
        }

        const lookup_err = (err) => {
            console.log('replaceEpoxideOxygenWithDoubleBond(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
        case "epoxide":
        return {
        "R1": R1,
        "R2": R2,
        "R3": R3,
        "R4": R4,
        "Group":"C1OC1"
        }
        */
        MoleculeLookup(db, functionalGroups.epoxide[2] + "C(" + functionalGroups.epoxide[1]  + ")=C(" + functionalGroups.epoxide[4] + ")" + functionalGroups.epoxide[3],
            "SMILES", true, "replaceEpoxideOxygenWithDoubleBond", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceEpoxideOxygenWithDoubleBond"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceEpoxideOxygenWithDoubleBond"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    const replaceHydrogenWithHalideReverse = (callback) => {
        if (false) {
            console.log('calling replaceHydrogenWithHalideReverse()')
        }

        const lookup_err = (err) => {
            console.log('replaceHydrogenWithHalideReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        //const SMILES_with_hydrogens = "canonical_SMILES with hydrogens"
        // chloroephedrine
        // CC(C(C1=CC=CC=C1)Cl)NC
// CC(C(C1=CC=CC=C1))NC

        const halides = ["Cl", "Br", "At", "F", "I"]
        halides.map(
            (X)=> {
                ///CC(CC1=CC=CC=C1)NC
                const r = range.range(0, molecule_json_object.CanonicalSMILES.length)
                r.map(
                    (i) => {
                        const S = molecule_json_object.CanonicalSMILES.substr(0, i) + X + molecule_json_object.CanonicalSMILES.substr(i)
                        MoleculeLookup(db, S, true,  "replaceHydrogenWithHalideReverse", lookup_err).then(
                            (substrate) => {
                                callback ? callback(
                                    rule,
                                    molecule_json_object,
                                    substrate,
                                    rule.reagents,
                                    child_reaction_as_string,
                                    "replaceHydrogenWithHalideReverse"
                                ) : render(
                                    rule,
                                    molecule_json_object,
                                    substrate,
                                    rule.reagents,
                                    child_reaction_as_string,
                                    "replaceHydrogenWithHalideReverse"
                                )
                            },
                            (err) => {
                                lookup_err(err)
                            }
                        )
                    }
                )
            }
        )
    }




    const alkeneToAmideReverse = () => {
        if (false) {
            console.log('calling alkeneToAmideReverse()')
        }

        const lookup_err = (err) => {
            console.log('alkeneToAmideReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        const amine_parsed = CanonicalSmilesParserV2(this.amide[1].indexOf("N")===-1?this.amide[2].indexOf("N"):this.amide[1].indexOf("N"))

        MoleculeLookup(db, amine_parsed[1] + "=" + amine_parsed[2],
            "SMILES", true, "amine_parsed", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        [this.amide[1]+"C#N"],
                        child_reaction_as_string,
                        "amine_parsed"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        [this.amide[1]+"C#N"],
                        child_reaction_as_string,
                        "amine_parsed"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )


    }

    const amineToAmideReverse = () => {
        if (false) {
            console.log('calling alkeneToAmideReverse()')
        }

        const lookup_err = (err) => {
            console.log('amineToAmideReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
        Formic acid + methylamine = N-Methylformamide

        Methylamine
        CN

        (formic acid)
        C(=O)O

        CN + C(=O)O -> CNC=O
        R1CNR2 + R3C(=O)O  -> R1CN(R2)C(R3)=O

        // Reversal
    const amide_parsed = FunctionalGroupParser("amide", SMILES)
    return [
            {
                "substrate": amide_parsed.N_group,
                "reagent": amide_parsed.N_group.R1 + "C(=O)O"
            }
        ]
    */

        MoleculeLookup(db, functionalGroups.amide[1].indexOf("N")===-1?functionalGroups.amide[2]:functionalGroups.amide[1], true, "amineToAmideReverse", lookup_err).then(
            (substrate) => {
                callback ? callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    functionalGroups.amide[1].indexOf("N")===-1?functionalGroups.amide[2].substr(1):functionalGroups.amide[1].substr(1)+ "C(=O)O",
                    child_reaction_as_string,
                    "amineToAmideReverse"

                ) : render(
                    rule,
                    molecule_json_object,
                    substrate,
                    functionalGroups.amide[1].indexOf("N")===-1?functionalGroups.amide[2].substr(1):functionalGroups.amide[1].substr(1)+ "C(=O)O",
                    child_reaction_as_string,
                    "amineToAmideReverse"

                )
            },
            (err) => {
                lookup_err(err)
            }
        )



    }

    const carboxylicAcidToKetoneReverse = (callback) => {
        if (false) {
            console.log('calling carboxylicAcidToKetoneReverse()')
        }

        const lookup_err = (err) => {
            console.log('carboxylicAcidToKetoneReverse(). Error looking up substrate(s)')
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



    const ketoneToTertiaryAmineReverse =  () => {
        if (false) {
            console.log('calling ketoneToTertiaryAmineReverse()')
        }

        const lookup_err = (err) => {
            console.log('ketoneToTertiaryAmineReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        MoleculeLookup(db, "O=(" + functionalGroups.tertiary_amine[1] + ")" + functionalGroups.tertiary_amine[2] + "(" + functionalGroups.tertiary_amine[3] + ")", true, "ketoneToTertiaryAmineReverse", lookup_err).then(
            (substrate) => {
                callback ? callback(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "ketoneToTertiaryAmineReverse"
                ) : render(
                    rule,
                    molecule_json_object,
                    substrate,
                    rule.reagents,
                    child_reaction_as_string,
                    "ketoneToTertiaryAmineReverse"
                )
            },
            (err) => {
                lookup_err(err)
            }
        )



    }





    /*
    const addAtomGroupBranch = (atom_group, callback ) => {
        // 'CC(CC1=CC2=C(C=C1)OCO2)NC'
        //[0...canonical_SMILES.length-1].map(
        canonical_SMILES.map(
            (index) => {
                callback ? callback(
                    rule,
                    canonical_SMILES,
                    index === 0 ?
                        '(' + atom_group + ')'
                        +  canonical_SMILES ?
                            index === canonical_SMILES.length - 1 ? substrate_JSON_object + '(' + atom_group + ')'
                                : canonical_SMILES.substr(0, index) + '(' + atom_group + ')' + canonical_SMILES.substr(index + 1),
                    rule.reagents
                ) : render(
                    rule,
                    canonical_SMILES,
                    index === 0 ?
                        '(' + atom_group + ')' + substrate_JSON_object ?
                            index === canonical_SMILES.length - 1 ? substrate_JSON_object + '(' + atom_group + ')' : canonical_SMILES.substr(0, index) + '(' + atom_group + ')' + canonical_SMILES.substr(index + 1),
                    rule.reagents
                )
            }
        )
    }
     */


    const splitGlycol = (glycol_molecule, callback) => {

        //console.log(glycol_molecule)
        //process.exit()

        if (false) {
            console.log("calling 'splitGlycol()")
        }

        const g = FunctionalGroups(glycol_molecule).functionalGroups.glycol

        const lookup_err = (err) => {
            console.log('splitGlycol(). Error')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        if (g !== false) {

            // console.log('Is a glycol - ' + glycol_molecule.CanonicalSMILES)
            //console.log(g)
            //console.log("Looking up " + "O=C(" + g[0] + ")" + g[1])

            MoleculeLookup(db, "O=C(" + g[0] + ")" + g[1], "SMILES", true, "splitGlycol", lookup_err).then(
                (substrate) => {
                    callback ? callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        'splitGlycol - ' + molecule_json_object.CanonicalSMILES,
                        )
                        : render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        'splitGlycol - ' + molecule_json_object.CanonicalSMILES,
                        )
                },
                (err) => {
                    lookup_err(err)
                }
            )

            // console.log("Looking up " + "O=C(" + g[2] + ")" + g[3])

            MoleculeLookup(db, "O=C(" + g[2] + ")" + g[3], "SMILES", true, "splitGlycol", lookup_err).then(
                (substrate) => {
                    callback ? callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        'splitGlycol - ' + molecule_json_object.CanonicalSMILES,
                        )
                        : render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        'splitGlycol - ' + molecule_json_object.CanonicalSMILES,
                        )
                },
                (err) => {
                    lookup_err(err)
                }
            )
        } else {
            // console.log('Not a glycol - ' + glycol_molecule.CanonicalSMILES)
        }

    }

    const revertSplitGlycolBackToWhole = (callback) => {


        if (false) {
            console.log('calling revertSplitGlycolBackToWhole()')
        }

        const lookup_err = (err) => {
            console.log('revertSplitGlycolBackToWhole(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        MoleculeLookup(db, ("CC(O)C(O)(" + functionalGroups.ketone[1].substr(0) + ")(" + functionalGroups.ketone[2].substr(0) + ").*").replace(/\(\)/, ""), "SMILES", true, "revertSplitGlycolBackToWhole", lookup_err).then(

            (substructures) => {

                try {

                    if (!substructures.map) {
                        substructures = [substructures]
                    }

                    substructures.map(
                        (substrate) => {
                            if (substrate.IUPACName.indexOf('dioxol') !== -1 || substrate.IUPACName.indexOf('dioxole') !== -1) {

// Check that if we split the glycol we get the end product as one of the parts
                                splitGlycol(substrate, (rule, molecule_json_object, glycol_component) => {
                                    if (substrate.CanonicalSMILES === glycol_component.CanonicalSMILES) {

                                        substrate.functional_groups = FunctionalGroups(substrate).functionalGroupsList()
                                        callback ? callback(
                                            rule,
                                            molecule_json_object,
                                            substrate,
                                            rule.reagents,
                                            child_reaction_as_string,
                                            'revertSplitGlycolBackToWhole() - ' + molecule_json_object.CanonicalSMILES,
                                            )
                                            : render(
                                            rule,
                                            molecule_json_object,
                                            substrate,
                                            rule.reagents,
                                            child_reaction_as_string,
                                            'revertSplitGlycolBackToWhole() - ' + molecule_json_object.CanonicalSMILES,
                                            )
                                    }
                                })


                            }
                        })
                } catch(e) {
                    console.log(substructures)
                    console.log(e)
                    process.exit()
                }



            },
            (err) => {
                lookup_err(err)
            }
        )
    }



    const replaceHalideWithNCReverse = (callback) =>{
// 'CC(CC1=CC2=C(C=C1)OCO2)NC'
        if (false) {
            console.log('calling replaceHalideWithNCReverse()')
        }

        const lookup_err = (err) => {
            console.log('replaceHalideWithNCReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("NC","Cl"), "SMILES", true, "replaceHalideWithNCReverse", false).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse()"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse()"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )


        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("NC","Br"), "SMILES", true, "replaceHalideWithNCReverse", false).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("NC","F"), "SMILES", true, "replaceHalideWithNCReverse", false).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("NC","I"), "SMILES", true, "replaceHalideWithNCReverse", false).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

        MoleculeLookup(db, molecule_json_object.CanonicalSMILES.replace("NC","[At]"), "SMILES", true, "replaceHalideWithNCReverse", false).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "replaceHalideWithNCReverse"
                    )
            },
            (err) => {
                lookup_err(err, 'replaceHalideWithNCReverse(). Error looking up substrate')
            }
        )

    }



    const ___replaceCarboxylWithNCReverse = () =>{

    }



    const __replaceCarboxylWithNCCReverse = () =>{
        return canonical_SMILES.replace("NC(C)","(=O)")
    }

    const __replaceCarboxylWithNReverse = () =>{
        return canonical_SMILES.replace("N","(=O)")
    }





    const esterToAlcoholReverse =  ( callback, r_group ) => {
        if (false) {
            console.log('calling esterToAlcoholReverse()')
        }

        const lookup_err = (err) => {
            console.log('esterToAlcoholReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
 // ethanol CCO
 return [
 "OH",
 canonical_SMILES.match(/(.*)CO/).pop()
 ]
 const primary_alcohol_SMILES = 'CC(O)


 alcohol: ['OH', 'CC'],
 CC(=O)O
 propanoic acid
 CCC(=O)O

 */
        MoleculeLookup(db, functionalGroups.alcohol[1]  + "C(=O)O" + (!r_group?"":".*"),
            "SMILES", true, "esterToAlcoholReverse", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "esterToAlcoholReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "esterToAlcoholReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )


    }



    return {
        functionalGroups: functionalGroups,
        amineToAmideReverse: amineToAmideReverse,
        carboxylicAcidToKetoneReverse:carboxylicAcidToKetoneReverse,
        alkeneToAmideReverse:alkeneToAmideReverse,
        revertSplitGlycolBackToWhole:revertSplitGlycolBackToWhole,
        replaceSingleAtom: replaceSingleAtom,
        replaceHalideWithNH2Reverse:replaceHalideWithNH2Reverse,
        replaceHydrogenWithHalideReverse:replaceHydrogenWithHalideReverse,
        replaceCarboxylOxygenWithCarbon: replaceCarboxylOxygenWithCarbon,
        replaceORGroupOnCarboxylCarbonWithOCation: replaceORGroupOnCarboxylCarbonWithOCation,
        convertAlcoholToEster: convertAlcoholToEster,
        mashCarboxylGroupsIntoAnEpoxideRing: mashCarboxylGroupsIntoAnEpoxideRing,
        alcoholToEpoxide: alcoholToEpoxide,
        replaceORGroupOnCarboxylCarbonWithOH: replaceORGroupOnCarboxylCarbonWithOH,
        replaceEpoxideOxygenWithDoubleBond: replaceEpoxideOxygenWithDoubleBond,
        ketoneToTertiaryAmineReverse: ketoneToTertiaryAmineReverse,

        replaceHalideWithNCReverse: replaceHalideWithNCReverse,

        reductiveAminationReverse:reductiveAminationReverse ,


        esterToAlcoholReverse: esterToAlcoholReverse,

        tertiaryAmineToHalogenalkane: tertiaryAmineToHalogenalkane
    }

}


module.exports = CanonicalSMILESParserV2























