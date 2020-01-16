const FunctionalGroups = (molecule_json_object) => {

    const normalizeSMILES = () => {
        // const nom  = CCNomenclature(molecule_json_object)
        // CC(CC1=CC2=C(C=C1)OCO2)NC
        // console.log(molecule_json_object)
        return molecule_json_object.CanonicalSMILES
    }

    const canonical_SMILES = normalizeSMILES()




    const ketone = () => {

        // carboxylic salt tests parser.functionalGroups.ketone[0].should.be.equal(expected_results.ketone[0]) ->  expected 'OC' to be 'CC
// const canonical_SMILES = 'CC(=O)OC'
// methyl acetate
// CC(=O)OC

        // CC(=O)CC1=CC2=C(C=C1)OCO2
        // O=C(C)Cc1ccc2OCOc2c1
        // Reformulate SMILES so that the =O is first.
        if (canonical_SMILES.indexOf("=O") === -1) {
            return false
        }

        if (canonical_SMILES.indexOf("=O") === 0) {
            return [
                "O",
                canonical_SMILES.substr(3).replace(/\(.*\)/, ""),
                canonical_SMILES.substr(3).match(/\(.*\)/) === null ? canonical_SMILES.substr(3) : canonical_SMILES.substr(3).match(/\(.*\)/).pop()
            ]
        }

        if (canonical_SMILES.indexOf("=O") ===canonical_SMILES.length-2 ) {

// CC(CC1=CC2=C(C=C1)OCO2)C=O
// [ 'O', '', 'CC1=CC2=C(C=C1)OCO2)C=O' ]
// should be  [ 'O', '', 'CC(CC1=CC2=C(C=C1)OCO2)' ]

// / CC(CC1=CC2=C(C=C1)OCO2)C=O
            return [
                "O",
                canonical_SMILES.substr(0,canonical_SMILES.length-3),
                ""
            ]
        }

        // First get all atoms to the left of the =O atom, remove any atoms in brackets
        // CC(=O)OC
        // CC(=O)CC1=CC2=C(C=C1)OCO2 MD2P
// const canonical_SMILES = 'CC(=O)OC'
        // methyl ketone test parser.functionalGroups.ketone[0].should.be.equal(expected_results.ketone[0]) - expected 'C' to be 'CC'
// const methyl_ketone_SMILES = 'CCC(=O)C'
// butan-2-one
// CCC(=O)C



        return [
            "O",
            canonical_SMILES.substr(canonical_SMILES.indexOf("(=O") + 4),
            canonical_SMILES.substr(0, canonical_SMILES.indexOf("(=O")-1), // CC
        ]

    }


    const amide = () => {
        if ((canonical_SMILES.indexOf("(=O") !== -1 || canonical_SMILES.indexOf("O=") !== -1) && canonical_SMILES.indexOf("N")!==-1) {
            return ketone()
        } else {
            return false
        }
    }

    const glycol = () => {


// CC(C(C1=CC2=C(C=C1)OCO2)O)O
// CC(C(C1=CC2=C(C=C1)OCO2)O)(H)O
// CC(C(C1=CC2=C(C=C1)OCO2)(H)O)(H)O


        if (canonical_SMILES.substr(canonical_SMILES.length-2) !== ")O") {
            return false
        }

        return [

            canonical_SMILES.match(/^(.*?)C\(.*\).*O$/)===null?"H":canonical_SMILES.match(/^(.*?)C\(.*\).*O$/).pop(),

            canonical_SMILES.match(/^.*C\(.*\)(.*)O$/)===null?"H":canonical_SMILES.match(/^.*C\(.*\)(.*)O$/).pop(),

            canonical_SMILES.match(/^.*C\(C\((.*)\).*O\).*O$/)===null?"H":canonical_SMILES.match(/^.*C\(C\((.*)\).*O\).*O$/).pop(),

            canonical_SMILES.match(/^.*C\(C\(.*\)(.*)O\).*O$/)===null?"H":canonical_SMILES.match(/^.*C\(C\(.*\)(.*)O\).*O$/).pop()


        ]
    }

    const amine = (() => {

        // const secondary_amine_SMILES = 'CC(CC1=CC2=C(C=C1)OCO2)NC'
        //console.log(molecule_json_object.CanonicalSMILES)

        if (!molecule_json_object.CanonicalSMILES) {
            console.log('FunctionalGroups.js (amine) error getting smiles')
            console.log(molecule_json_object)
            process.exit()

        }
        if (molecule_json_object.CanonicalSMILES.indexOf("N") === -1) {
            return false
        }
        //CC(CC1=CC2=C(C=C1)OCO2)NC



        //CC(CC1=CC2=C(C=C1)OCO2)NC



// O=C(C(C)(CC1=CC2=C(C=C1)OCO2)) / CC(CC1=CC2=C(C=C1)OCO2)C=O


// CC(CC1=CC2=C(C=C1)OCO2)NC
        const m1 = canonical_SMILES.match(/(.*)\(.*\)N/)
//O=C(C(C)(CC1=CC2=C(C=C1)OCO2))
//C(C)(CC1=CC2=C(C=C1)OCO2)
//m1===null?”H”:m[0].substr(m[0].length-1) + // (m[0].length>1?”(“+m[0].substr(0,m[0].length-1)+”)”:””) + “(“ + m[1] + “)”
// m1 = [CC, CC1=CC2=C(C=C1)OCO2]
// C(C)(CC1=CC2=C(C=C1)OCO2)
//  "O=C("+functionalGroups.secondary_amine[2]+")",
//  O=C(C(C)(CC1=CC2=C(C=C1)OCO2))
        // process.exit()

//        console.log(m1)
        /*
[ 'CC(CC1=CC2=C(C=C1)OCO2)N',
  'CC(CC1=CC2=C',
  index: 0,
  input: 'CC(CC1=CC2=C(C=C1)OCO2)NC' ]
         */


        // CC(CC1=CC=CC=C1)NC
        // CC(CC1=CC=CC=C1)
//        C(C)(CC1=CC=CC=C1)
        //      O=C(C(C)(CC1=CC=CC=C1))

        /*

[ 'N', 'H', 'N', 'C' ]

         */


        return [
            "N",
            canonical_SMILES.substr(canonical_SMILES.indexOf("N") + 1).match(/\(.*\)/) === null ? "H" :
                canonical_SMILES.substr(canonical_SMILES.indexOf("N") + 1).match(/\(.*\)/) === null ? "H" : canonical_SMILES.substr(canonical_SMILES.indexOf("N") + 1).match(/\(.*\)/).pop(), // C

            m1===null?"H":m1[0].substr(0,m1[0].length-1), // (m[0].length>1?”(“+m[0].substr(0,m[0].length-1)+”)”:””) + “(“ + m[1] + “)”
            //  C(C)(CC1=CC2=C(C=C1)OCO2)

            canonical_SMILES.substr(canonical_SMILES.indexOf("N") + 1).replace(/\(.*\)/, "") // C

        ]

    }).call()

    const primaryAmine = () => {
        return amine === false ? false :
            (amine.filter((branch) => {
                    return branch === "H"
                }).length === 2 ? amine : false

            )
    }

    const secondaryAmine = () => {
        // [ 'N', 'H', 'CC(CC1=CC2=C(C=C1)OCO2)', 'C' ]
        return amine === false ? false :
            (amine.filter((branch) => {
                    return branch === "H"
                }).length === 1 ? amine : false
            )
    }


    const tertiaryAmine = () => {
        return amine === false ? false :
            (amine.filter((branch) => {
                    return branch === "H"
                }).length === 0 ? amine : false
            )
    }


    const epoxide = () => {

// const epoxide_SMILES = 'CC1(C(O1)(C)C)C'
// 2,2,3,3-tetramethyloxirane
// CC1(C(O1)(C)C)C

        if ((canonical_SMILES.indexOf("CO1") === -1 && canonical_SMILES.indexOf("C(O1") === -1)
            || canonical_SMILES.substr(canonical_SMILES.length -1) === "O" || canonical_SMILES.indexOf("=O")!==-1) {
            return false
        }

        /*
        Atoms to the left of C1 are R1 atoms
        Atoms to the right of C1(.*) are R2 atoms
        Atoms branching off epoxide C and not O1 are R3 and R4 atoms
        */

        // CC1(C(O1)(C)C)C
// R1C1(C(O1)(R3)R4)R2o


        return [
            "O",
            canonical_SMILES.match(/^(.*)C1/)===null?"H":canonical_SMILES.match(/^(.*)C1/).pop(),// R1
            canonical_SMILES.match(/C1.*\)(.*)$/)===null?"H":canonical_SMILES.match(/C1.*\)(.*)$/).pop(), // R2
            canonical_SMILES.match(/.*O1\)\((.*?)\)/)===null?"H":canonical_SMILES.match(/.*O1\)\((.*?)\)/).pop(), // R3
            canonical_SMILES.match(/.*O1\)\(.*?\)(.*)\)/)  === null? "H":canonical_SMILES.match(/.*O1\)\(.*?\)(.*)\)/).pop()//R4
        ]

    }


    const alcohol = () => {
        /*
    // ethanol CCO
 // primary alcohol tests - parser.functionalGroups.alcohol.should.be.a.Array() - expected false to be an array
 // const primary_alcohol_SMILES = 'CC(O)'
 // ethanol
 // CCO

 // glycol tests - parser.functionalGroups.alcohol.should.be.a.Array() - expected false to be an array
 //  const glycol_SMILES = 'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
 // 1-(1,3-benzodioxol-5-yl)propane-1,2-diol
 // CC(C(C1=CC2=C(C=C1)OCO2)O)O




    */
        if (glycol()){
            return false
        }
        if (canonical_SMILES[canonical_SMILES.length- 2] !== "CO" && canonical_SMILES[canonical_SMILES.length- 4] !== "C(O)" && canonical_SMILES[canonical_SMILES.length-2] !== ")O" ) {
            return false
        }

        return [
            "OH",
            canonical_SMILES[canonical_SMILES.length- 2] !== "CO"?canonical_SMILES.match(/(.*)O/).pop():canonical_SMILES.match(/(.*)\(O/).pop()
        ]


    }

    const aldehyde = () => {
        const k = ketone()
        return k[1] === "" || k[2] == "" ? k : false
    }

    const ester = () => {


        const k = ketone()
        if (k===false) {
            return false
        }

        //if (k[0].indexOf("O") !== 0 && (k[2].indexOf("O") ===-1 || k[2].indexOf("O") !== 0)) {
        if (k[2].indexOf("O") ===-1) {
            return false
        }
        return [
            k[0],
            k[0].indexOf("O") === 0 ? k[1] : k[2],
            k[0].indexOf("O") === 0 ? k[2] : k[1],
        ]

    }

    const canonical_SMILES = normalizeSMILES()

 const terminalAlkene = () => {
//Safrole 

// C=CCC1=CC2=C(C=C1)OCO2
f (canonical_SMILES.indexOf("C=") === 0) {
           return [canonical_SMILES]
       }
}
return false 
}



    

    const functionalGroups = {
        "ketone": ketone(),
        "tertiary_amine": tertiaryAmine(),
        "secondary_amine": secondaryAmine(),
        "primary_amine": primaryAmine(),
        "amide": amide(),
        "epoxide": epoxide(),
        "ester": ester(),
        "glycol": glycol(),
        "alcohol": alcohol(),
        "aldehyde": aldehyde()

    }

    const functionalGroupsList = () => {
        return [
            functionalGroups.tertiary_amine ? "tertiary amine" : false,
            functionalGroups.secondary_amine ? "secondary amine" : false,
            functionalGroups.primary_amine ? "primary amine" : false,
            functionalGroups.amide ? "amide" : false,
            functionalGroups.epoxide ? "epoxide" : false,
            functionalGroups.ester ? "ester" : false,
            functionalGroups.glycol ? "glycol" : false,
            functionalGroups.alcohol ? "alcohol" : false,
            functionalGroups.aldehyde ? "aldehyde" : false,
            functionalGroups.ketone ? "ketone" : false
        ].filter(
            (item) => {
                return item !== false
            }
        )

    }


    return {
        functionalGroups: functionalGroups,
        functionalGroupsList: functionalGroupsList

    }

}

module.exports = FunctionalGroups











