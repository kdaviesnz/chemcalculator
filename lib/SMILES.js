const parse = require('parenthesis')

/*
// Parse into nested format
console.log(parse('CC(CC1=CC=CC=C1)NC'))
// [ 'CC(', [ 'CC1=CC=CC=C1' ], ')NC' ]

console.log(parse('CC(CC1=CC=CC=C1)NC', {
    brackets: ['()'],
    escape: '\\',
    flat: true
}))
// [ 'CC(\\1\\)NC', 'CC1=CC=CC=C1' ]

console.log(parse('CC(CC1=CC=CC=C1)NC', {
    brackets: ['()'],
    escape: '\\',
    flat: false
}))
// [ 'CC(', [ 'CC1=CC=CC=C1' ], ')NC' ]
 */

const SMILESParser = {
    findCarbonylCarbonIndex: function (SMILES) {
        if (SMILES.indexOf("C=O")) {
            return end_product_JSON_object.SMILES.indexOf("C=O")
        } else if (indexOf(")=O")) {
            return SMILES.findMatchingOpeningBracketIndex(SMILES.indexOf(")=O") - 1)
        }
    },

    findMatchingOpeningBracketIndex: function (SMILES, closing_bracket_index) {
        return 0
    },

    replaceSingleAtom: function (SMILES, atom_index, replacement) {

    },

    replaceAtom: function (SMILES, atom, replacement) {
        // replace atom and atoms bonded to it with replacement
        return SMILES
    },

    replaceCarboxylWithGlycol: function (SMILES) {
        // CC(CC1=CC2=C(C=C1)OCO2)=O MDP2P
        // CC(C(C1=CC2=C(C=C1)OCO2)O)O isosafrole glycol
        // @todo
        const generic_12_diol_SMILES = "OC(RR)C(LR)O"
        if (end_product_JSON_object.SMILES.indexOf("C=O")) {
            const carbonyl_carbon_index = end_product_JSON_object.SMILES.indexOf("C=O")
        } else if (end_product_JSON_object.SMILES.indexOf(")=O")) {
            const carbonyl_carbon_index = SMILES.findMatchingOpeningBracketIndex(end_product_JSON_object.SMILES.indexOf(")=O") - 1)// Find matching opening bracket position
        }
        const left_R = [...end_product_JSON_object.SMILES].slice(0, carbonyl_carbon_index - 1).join("")
        const right_R = [...end_product_JSON_object.SMILES].slice(carbonyl_carbon_index + 1, end_product_JSON_object.SMILES.indexOf("=O")).join("")
        const substrate_SMILES = generic_12_diol_SMILES.replace("RR", right_R).replace("LR", left_R)
        return SMILES
    },

    mashCarboxylGroupsIntoAnEpoxideRing: function (SMILES) {
    },

    convertAlcoholToEster: function (SMILES) {
    },


    replaceCarboxylOxygenWithCR: function (SMILES) {
        // 3,4-Methylenedioxyphenyl acetone (PMK)
        // CC(CC1=CC2=C(C=C1)OCO2)=O -> CC(CC1=CC2=C(C=C1)OCO2)=C(R)R
        // substitute O on terminal double bond for CR where R can be hydrogen
    },

    replaceCarboxylOxygenWithCarbon: function (SMILES) {
        // ADD oxygen DOUBLE BOND TO terminal alkene ON MOST SUBSTITUTED carbon(do reverse of)
    },

    replaceORGroupOnCarboxylCarbonWithOCation: function (SMILES) {

    },

    replaceORGroupOnCarboxylCarbonWithOH: function (SMILES) {
        const carbonyl_carbon_index = this.findCarbonylCarbonIndex(end_product_JSON_object.SMILES)
        // Find index of O atom that is singly bonded to carbonyl carbon.
        if (end_product_JSON_object.SMILES[carbonyl_carbon_index - 1] === "O") {
            // eg OC(C)=O —> ROC(C)=O
            const substrate = "R" + end_product_JSON_object.SMILES
        } else if (end_product_JSON_object.SMILES[carbonyl_carbon_index + 1] === "O") {
            const substrate = "R" + end_product_JSON_object.SMILES + "R"
        }
    },

    replaceHalideWithNH2: function (SMILES) {

    },

    replaceEpoxideOxygenWithDoubleBond: function (SMILES) {

    },

    replaceHydrogenWithHalide: function (SMILES) {

    },

    revertSplitGlycolBackToWhole: function (SMILES) {

    },

    findAtomIndex: function (SMILES, atom) {

    },


    findAttachedAtomIndex: function (SMILES, source_atom_index) {

    },

    alkeneToAmideReverse: function (SMILES) {

        /*
        alkene
        R1C=CR2
        Nitrile
        R3C#N
        N-alkyl amide
        RC(=O)N

        Substrate
        R1.              R2
        <BC>C1=C2

        Reagent
         R3
        <C>C3#N1

        Product
        <BC>C1(N1(C3(=O)<C>))C2
        R1C1(N1(C3(=O)R3)C2R2

        Reversal
        */
        // This is the nitrile carbon.
        const nitrile_c = this.findCarbonylCarbonIndex(SMILES)

        const nitrile_n = 0 /*Nitrogen attached to carboxyl carbon is the nitrile nitrogen.*/
        const nitrile_r = 'CCC' /* Atom group attached to carboxyl atom which is not =O or N is the nitrile R group. */

        const nitrile = nitrile_r + "C#N"

        const alkene__left = 'CCC' /* carbon atom group attached to nitrogen and which is not the Carboxyl carbon*/
        const alkene__right = 'CCC' /* carbon atom group attached to nitrile_r and which is not the Carboxyl oxygen */

        const alkene = alkene__left + "="  /* alkene__right */
    },

    amineToAmideReverse: function (SMILES) {

        /*
        Formic acid + methylamine = N-Methylformamide

        Methylamine
        CN

        (formic acid)
        C(=O)O

        CN + C(=O)O -> CNC=O
        R1CNR2 + R3C(=O)O  -> R1CN(R2)C(R3)=O


         */
        // Reversal

        const carbonyl_o = 0 /* get index of carbonyl oxygen */
        const carbonyl_c = 0 /* get index of carbonyl carbon */
        const amine_n = 0 /* get index of nitrogen atom attached to carbonyl carbon */

        const r1_group = 'CCCC' /* carbon atom group attached to amine_n that does not contain the carbonyl_c */
        const r2_group = 'CCCC' /* atom group attached to amine_n that does not contain the carbonyl_c and is not r1_group */
        const r3_group = 'CCC' /* atom group attached to amine_n that does not contain the carbonyl_c and is not r1_group */
        // R1CN(R2)C(R3)=O
        return r1_group + "CN(" + r2_group + ")C(" + r3_group + ")=O"
    },

    carboxylicAcidToKetoneReverse: function (SMILES) {
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
        */

        const carboxylic_acid_carbonyl_c = 0 /* find index of carbonyl carbon on carboxylic acid */
        const r1_group = 'CCC' /* find atom group attached to carbonyl carbon on carboxylic acid but which is not =O or OH */
        const anhydride_carbonyl_c = 0 /* find index of carbonyl carbon on anhydride */
        const r2_group = 'CCC' /* find atom group attached to carbonyl carbon on anhydride but which is not =O or OC */

        // Reversal
        const keyone_c = 0 /* find carbonyl carbon on ketone */
        const r1 = 'CCCC' /* find atom group attached to carbonyl carbon on ketone that is not "=O" */
        const r2 = 'CCC' /* find atom group attached to carbonyl carbon on ketone that is not "=O" or r1. */

        return [
            {
                "substrate": r1 + "C(=O)O",
                "reagent": r2 + "C(=O)OC(=O)" + r2
            },
            {
                "substrate": R2 + "C(=O)O",
                "reagent": r1 + "C(=O)OC(=O)" + r1
            }
        ]

    },

    ketoneToAmineReverse: function (SMILES) {
        /*
        Leuckart Wallach reaction

        Phenylacetone
        CC(=O)CC1=CC=CC=C1
        R1 C(=O)R2

        N-Methylformamide
        CNC=O

        Methamphetamine
        CC(CC1=CC=CC=C1)NC
        */
        //Reversal
        //R1C(NC)R2
        const c = 0 /* index of carbon atom attached to nitrogen */
        const r1 = 'CCC' /* atom group attached to c that is not nitrogen */
        const r2 = 'CCC' /* atom group attached to c that is not nitrogen or R1C */
        return {
            "substrate": r1 + "C(=O)" + r2,
            "reagent": "CNC=O"
        }
    }

}

module.exports = SMILES
