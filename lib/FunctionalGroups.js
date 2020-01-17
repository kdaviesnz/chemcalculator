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
        const m1 = canonical_SMILES.match(/(.*)\(.*\)N/)

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


        if ((canonical_SMILES.indexOf("CO1") === -1 && canonical_SMILES.indexOf("C(O1") === -1)
            || canonical_SMILES.substr(canonical_SMILES.length -1) === "O" || canonical_SMILES.indexOf("=O")!==-1) {
            return false
        }


        return [
            "O",
            canonical_SMILES.match(/^(.*)C1/)===null?"H":canonical_SMILES.match(/^(.*)C1/).pop(),// R1
            canonical_SMILES.match(/C1.*\)(.*)$/)===null?"H":canonical_SMILES.match(/C1.*\)(.*)$/).pop(), // R2
            canonical_SMILES.match(/.*O1\)\((.*?)\)/)===null?"H":canonical_SMILES.match(/.*O1\)\((.*?)\)/).pop(), // R3
            canonical_SMILES.match(/.*O1\)\(.*?\)(.*)\)/)  === null? "H":canonical_SMILES.match(/.*O1\)\(.*?\)(.*)\)/).pop()//R4
        ]

    }


    const alcohol = () => {

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

        if (k[2].indexOf("O") ===-1) {
            return false
        }
        return [
            k[0],
            k[0].indexOf("O") === 0 ? k[1] : k[2],
            k[0].indexOf("O") === 0 ? k[2] : k[1],
        ]

    }


    const terminalAlkene = () => {
        //Safrole
        // C=CCC1=CC2=C(C=C1)OCO2
        if (canonical_SMILES.indexOf("C=") === 0) {
            return [canonical_SMILES]
        }

        return false
    }

    const methylKetone = () => {
       //A methyl ketone is a ketone in which a methyl group is attached to the carbonyl group.
        //  CC(=O)CC1=CC2=C(C=C1)OCO2
        const k = ketone()
        return k===false || (k[1]!=="C"&& k[2]!=="C")?false:k
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
        "aldehyde": aldehyde(),
        "terminal_alkene": terminalAlkene(),
        "methyl_ketone": methylKetone()


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
            functionalGroups.ketone ? "ketone" : false,
            functionalGroups.terminal_akene ? "terminal alkene" : false,
            functionalGroups.methyl_ketone ? "methyl ketone" : false
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











