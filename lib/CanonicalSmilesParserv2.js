const FunctionalGroups = require('../lib/FunctionalGroups')
const range = require("range");
const MoleculeLookup = require('../lib/MoleculeLookup')

const CanonicalSMILESParserV2 = (molecule_json_object, db, rule, child_reaction_as_string, render, Err) => {


    const functionalGroups = FunctionalGroups(molecule_json_object).functionalGroups


      const oxymercurationReverse = (callback)  => {

        if (false) {
            console.log('calling oxymercurationReverse()')
        }

        const lookup_err = (err) => {
            console.log('oxymercurationReverse() Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        
                // (rule, canonical_SMILES, substrate_JSON_object, reagents)
                MoleculeLookup(db, "C#C" + functionalGroups.ketone[1], "SMILES", true, "oxymercurationReverse()", false).then(
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
    
// tertiaryAmineToHalogenalkane("N","X")
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

    const permanganateOxidation = (alkene_molecule, callback) => {

        if (true) {
            console.log('calling permanganateOxidation()')
        }

        const lookup_err = (err) => {
            console.log('permanganateOxidation(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // CC(=O)CC1=CC2=C(C=C1)OCO2
        // [ 'CC(=O)CC1=C', 'C2=C', '(C=C1' ]
        // console.log("alkene_molecule.CanonicalSMILES")
        // console.log(alkene_molecule.CanonicalSMILES)
        // CC(=O)CC1=CC2=C(C=C1)OCO2
        // process.exit()
        // console.log(alkene_molecule.CanonicalSMILES.match(/(.*?C[0-9]*?\=)C[0-9]*.*?/g))
        // [ 'CC(=O)CC1=C', 'C2=C', '(C=C1' ]
        process.exit()

        alkene_molecule.CanonicalSMILES.match(/(.*?C[0-9]*?\=)C[0-9]*.*?/g).map(
            (component_SMILES) => {
                MoleculeLookup(db, component_SMILES + "O", "SMILES", true, "permanganateOxidation",   null).then(
                    (mol) => {
                        callback(mol)
                    },
                    (err) => {
                        lookup_err(err)
                    }
                )
            }
        )

        //console.log(alkene_molecule.CanonicalSMILES.match(/.*?C[0-9]*?(\=C[0-9]*.*?)/g))
        // [ 'CC(=O)CC1=C', 'C2=C', '(C=C1' ]
        //process.exit()

        alkene_molecule.CanonicalSMILES.match(/.*?C[0-9]*?(\=C[0-9]*.*?)/g).map(
            (component_SMILES) => {
                MoleculeLookup(db, "O" + component_SMILES, "SMILES", true, "permanganateOxidation", lookup_err).then(
                    (mol) => {
                        callback(mol)
                    },
                    (err) => {
                        lookup_err(err)
                    }
                )
            }
        )
    }

    const permanganateOxidationReverse = (callback) => {
        if (false) {
            console.log('calling permanganateOxidationReverse()')
        }

        const lookup_err = (err) => {
            console.log('permanganateOxidationReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

/*
1-(1,3-benzodioxol-5-yl)propan-2-one
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
  terminal_alkene: false }
 */

        MoleculeLookup(db, "C(=C.*)(" + functionalGroups.ketone[2] +")" + "(" + functionalGroups.ketone[1] + ")", "SMILES", true, "permanganateOxidationReverse", lookup_err).then(
            (substrates) => {
                /*
                  { _id: 5e1991cb66f7f212e7f2e0fd,
    CID: 5273808,
    CanonicalSMILES: 'CCOC(=O)C1=C(C2=C(C=CC3=C2OCO3)C(=C1C(=O)OCC)OC)C4=CC5=C(C=C4)OCO5',
    IUPACName: 'diethyl 9-(1,3-benzodioxol-5-yl)-6-methoxybenzo[g][1,3]benzodioxole-7,8-dicarboxylate',
    tags: [ 'C(=C.*)(C)(CC1=CC2=C(C=C1)OCO2)' ],
    children: [ 'C(=C)(C)(CC1=CC2=C(C=C1)OCO2)' ] } ]

                 */
                substrates.map(
                    (substrate) => {
                        /*
                        { _id: 5e1991bd66f7f212e7f2dfb8,
  CID: 72435,
  CanonicalSMILES: 'COC1=CC(=CC(=C1OC)OC)C2C3C(COC3=O)C(C4=CC5=C(C=C24)OCO5)O',
  IUPACName: '(5R,5aR,8aS,9R)-5-hydroxy-9-(3,4,5-trimethoxyphenyl)-5a,6,8a,9-tetrahydro-5H-[2]benzofuro[5,6-f][1,3]benzodioxol-8-one',
  tags: [ 'C(=C.*)(C)(CC1=CC2=C(C=C1)OCO2)' ],
  children: [ 'C(=C)(C)(CC1=CC2=C(C=C1)OCO2)' ] }

                         */
                        permanganateOxidation(molecule_json_object, (mol)=> {
                                if (mol.CanonicalSMILES === molecule_json_object.CanonicalSMILES) {

                                    callback ? callback(
                                        rule,
                                        molecule_json_object,
                                        substrate,
                                        rule.reagents,
                                        child_reaction_as_string,
                                        "permanganateOxidationReverse"
                                    ) : render(
                                        rule,
                                        molecule_json_object,
                                        substrate,
                                        rule.reagents,
                                        child_reaction_as_string,
                                        "permanganateOxidationReverse"
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



// 'O=C(C)Cc1ccc2OCOc2c1 MDP2P
// isosafrole glycol
//    isosafrole glycol - pinacol rearrangement -> MDP2P
// CC(C(C1=CC2=C(C=C1)OCO2)O)O isosafrole glycol
    const pinacolRearrangemenReverse = (callback)=> {
        if (false) {
            console.log('calling pinacolRearrangemenReverse()')
        }

        const lookup_err = (err) => {
            console.log('pinacolRearrangemenReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }


        // MDP2P
        // CC(=O)CC1=CC2=C(C=C1)OCO2

        /*
        ketone:
 [ 'O', 'CC1=CC2=C(C=C1)OCO2', 'C ]
 CO(C(O)CC1=CC2=C(C=C1)OCO2)
         */

/*
calling pinacolRearrangemenReverse()
Looking up
OC(C)C(O)C1=CC2=C(C=C1)OCO2

 */
        MoleculeLookup(db, "O" + "C(C)C(O)" + functionalGroups.ketone[1].substr(1), "SMILES", true, "pinacolRearrangemenReverse", lookup_err).then(
            (substrate) => {

                callback ? callback(
                    rule,
                    molecule_json_object.CanonicalSMILES,
                    "O" + "C(C)C(O)" + functionalGroups.ketone[1].substr(1),
                    rule.reagents,
                    child_reaction_as_string,
                    "pinacolRearrangemenReverse"
                    ) :
                    render(
                        rule,
                        molecule_json_object.CanonicalSMILES,
                        "O" + "C(C)C(O)" + functionalGroups.ketone[1].substr(1),
                        rule.reagents,
                        child_reaction_as_string,
                        "pinacolRearrangemenReverse()"
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

    const nagaiMethodReverse  = (callback) =>{
        if (false) {
            console.log('calling nagaiMethodReverse()')
        }

        const lookup_err = (err) => {
            // CC(CC1=CC=CC=C1)NC ->  CC(CC(O)1=CC=CC=C1)NC
            console.log('nagaiMethodReverse(). Error looking up substrate')
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
                                "nagaiMethodReverse()"
                            ):
                            render(
                                rule,
                                molecule_json_object,
                                substrate,
                                rule.reagents,
                                child_reaction_as_string,
                                "nagaiMethodReverse()"
                            )
                    },
                    (err) => {
                        lookup_err(err, 'nagaiMethodReverse(). Error looking up substrate')
                    }
                )
            }
        )

    }

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


    const reductiveAminationReverse = (callback)=>{

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



    const wackerOxidationReverse =  (callback) => {
        if (false) {
            console.log('calling wackerOxidationReverse()')
        }

        const lookup_err = (err) => {
            console.log('wackerOxidationReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        // ADD oxygen DOUBLE BOND TO terminal alkene ON MOST SUBSTITUTED carbon(do reverse of)
        if (functionalGroups.ketone===false || (functionalGroups.ketone[1]!=="C" && functionalGroups.ketone[2]!=="C")) {
            return false
        }

        /*
        calling wackerOxidationReverse()
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
  terminal_alkene: false }
Looking up CC1=CC2=C(C=C1)OCO2(=C)C

         */
        MoleculeLookup(db,
 "C=C" +
            functionalGroups.ketone[2] + functionalGroups.ketone[1],

            "SMILES", true, "wackerOxidationReverse", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "wackerOxidationReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "wackerOxidationReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )

    }

    const ritterReactionReverse = (callback) => {
        if (false) {
            console.log('calling ritterReactionReverse()')
        }

        const lookup_err = (err) => {
            console.log('ritterReactionReverse(). Error looking up substrate(s)')
            console.log('End product - ' + molecule_json_object.CanonicalSMILES)
            Err(err)
        }

        /*
               const amine_parsed = CanonicalSmilesParserV2(this.amide[1].indexOf("N")===-1?this.amide[2].indexOf("N"):this.amide[1].indexOf("N"))
        */
        if (functionalGroups.amide===false) {
            return false
        }
        const N_Branch = functionalGroups.amide[1][0]==="N"?functionalGroups.amide[1]:functionalGroups.amide[2]
        const R_Branch = functionalGroups.amide[1][0]==="N"?functionalGroups.amide[2]:functionalGroups.amide[1]

        // Replace N group containing carboxyl group wth =C
        MoleculeLookup(db, "*C=" + N_Branch.substr(1),
            "SMILES", true, "ritterReactionReverse", lookup_err).then(
            (substrate) => {
                callback?
                    callback(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "ritterReactionReverse"
                    ):
                    render(
                        rule,
                        molecule_json_object,
                        substrate,
                        rule.reagents,
                        child_reaction_as_string,
                        "ritterReactionReverse"
                    )
            },
            (err) => {
                lookup_err(err)
            }
        )


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
        permanganateOxidationReverse: permanganateOxidationReverse,
        convertAlcoholToEster: convertAlcoholToEster,
        mashCarboxylGroupsIntoAnEpoxideRing: mashCarboxylGroupsIntoAnEpoxideRing,
        alcoholToEpoxide: alcoholToEpoxide,
        pinacolRearrangemenReverse: pinacolRearrangemenReverse,
        replaceORGroupOnCarboxylCarbonWithOH: replaceORGroupOnCarboxylCarbonWithOH,
        replaceEpoxideOxygenWithDoubleBond: replaceEpoxideOxygenWithDoubleBond,
        ketoneToTertiaryAmineReverse: ketoneToTertiaryAmineReverse,

        nagaiMethodReverse: nagaiMethodReverse,
        replaceHalideWithNCReverse: replaceHalideWithNCReverse,

        reductiveAminationReverse:reductiveAminationReverse ,
        wackerOxidationReverse: wackerOxidationReverse,
        ritterReactionReverse: ritterReactionReverse,

        esterToAlcoholReverse: esterToAlcoholReverse,

        tertiaryAmineToHalogenalkane: tertiaryAmineToHalogenalkane
    }

}


module.exports = CanonicalSMILESParserV2























