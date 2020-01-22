const CanonicalSMILESParserV2 = require('./CanonicalSMILESParserV2')
const WackerOxidation = require('./reactions/WackerOxidation')
const PermanganateOxidation = require('./reactions/PermanganateOxidation')

const FindSubstrates = (verbose,  db, rule, end_product_JSON_object, child_reaction_as_string, render, Err) => {

    /*
    Each rule has a substrate and an end product. A substrate in this context is basically just a functional group. We get the end product functional groups and for each of them we try and match them against the rule substrate functional group. If there’s a match we perform an operation to determine the possible substrates and reagents.
    */

    switch(rule.substrate['functional group']) {


        case "alkyne":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "ketone":
                            if (rule.catalyst === "HgSO4" && rule.reagents.indexOf("H2SO4") > -1 && rule.reagents.indexOf("H2O") > -1) {
                                //console.log('FindSubstrates carboxylicAcidToKetoneReverse')
                                //process.exit()
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).carboxylicAcidToKetoneReverse()
                            }
                            break
                        case "methyl ketone":
                            if (rule.catalyst === "HgSO4" && rule.reagents.indexOf("H2SO4") > -1 && rule.reagents.indexOf("H2O") > -1) {
                                console.log('FindSubstrates oxymercurationReverse')
                                process.exit()
                               CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).oxymercurationReverse()
                            }
                            break                      
                    }
                }
            )
            break


        case "carboxylic acid":

            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "ketone":
                            if ((rule.catalyst === "pyridine" || (rule.catalyst === "sodium acetate") && rule.reagents.indexOf("acyclic carboxylic anhydride")>-1)){
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).carboxylicAcidToKetoneReverse()
                            }
                            break
                    }
                }
            )
            break

        case "secondary amine":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "amide":
                            if ((rule.catalyst === "red phosphorus") && rule.reagents.indexOf("HI") > -1){
                                //       CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom( "H","OH")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).secondaryAmineToAmide( "H","OH")
                            }
                            break
                    }
                }
            )
            break

        case "benzyl alcohol":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "akyl halide":
                            if ((rule.reagents.indexOf("Acetic acid")  > -1 &&  rule.reagents.indexOf("HCl")  > -1)
                                || (rule.reagents.indexOf("Thionyl chloride")  > -1 && rule.reagents.indexOf("chloroform"  > -1)
                                    || rule.reagents.indexOf("PCl5")  > -1) && rule.reagents.indexOf("chloroform")  > -1)
                            {
                                //   CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("Cl","OH")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).benzylAlcoholToAkylHalide("Cl","OH")

                            }
                            break
                        case "aromatic hydrocarbon":

                            if ((rule.reagents.indexOf("Potassium metal") > -1 && rule.reagents.indexOf("anhydrous ammonia") > -1)
                                || (rule.reagents.indexOf("Sodium metal") > -1 && rule.reagents.indexOf("anhydrous ammonia") > -1)
                                || (rule.reagents.indexOf("Lithium metal") > -1 && rule.reagents.indexOf("anhydrous ammonia") > -1)
                                || (rule.catalyst === "PD/C" && (rule.reagents.indexOf("PBr3") > -1 && rule.reagents.indexOf("sodium acetate") > -1))
                                || (rule.catalyst === "PD/C" && (rule.reagents.indexOf("PBr5") > -1 && rule.reagents.indexOf("sodium acetate") > -1))
                                || (rule.catalyst === "PD/C" && (rule.reagents.indexOf("PCl3") > -1 && rule.reagents.indexOf("sodium acetate") > -1))
                                || (rule.catalyst === "PD/C" && (rule.reagents.indexOf("PCl3") > -1 && rule.reagents.indexOf("sodium acetate") > -1))
                                || (rule.catalyst === "PD/C" && (rule.reagents.indexOf("SOCl2") > -1 && rule.reagents.indexOf("sodium acetate") > -1))) {
                                //     CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom( "H","OH")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).aromaticHydrocarbonToBenzylAlcohol( "H","OH")

                            }
                            break
                    }
                }
            )
            break

        case "alcohol":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "secondary amine":
                            if ((rule.catalyst === "red phosphorus" && rule.reagents.indexOf("HI")!==-1)){
                                // NAGAI METHOD
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).nagaiMethodReverse()
                            }
                            break
                    }
                }
            )
            break

// case "1,2 Diol":
        case "glycol":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case  "carbonyl":
                        case "aldehyde":
                        case  "carboxylic acid":
                        case "ketone":

                            if ((rule.reagents.indexOf("HIO4") > -1 || rule.reagents.indexOf("Pb(OAc)4") > -1 || rule.reagents.indexOf("KMnO4") > -1)) {
                             CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err ).revertSplitGlycolBackToWhole()
                            }
                            break
                    }
                }
            )
            break

        case "1,2 Diol":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "ketone":
                        case "aldehyde":
                        case "carboxylic acid":
                        case "carboxylate ester":
                        case "amide":
                        case "enone":
                        case "acyl halide":
                        case "acid anhydride":
                        case "imide":
                            if (rule.reagents.indexOf("strong acid")  > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).pinacolRearrangemenReverse()
                            }
                            break
                    }
                }
            )
            break


        case "epoxide":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "alcohol":
                            if (rule.reagents.indexOf("HNU")  > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).alcoholToEpoxide()
                            }
                            break
                        case "glycol":
                        case "1,2 Diol":
                            if ((rule.catalyst.indexOf("H+")  > -1&& rule.reagents.indexOf("H2O") > -1)
                                || (rule.catalyst.indexOf("H2SO4")  > -1&& rule.reagents.indexOf("CH3OH") > -1)) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).mashCarboxylGroupsIntoAnEpoxideRing()
                            }
                            break
                    }
                }
            )
            break

        case "ester":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "primary alcohol":
                            if (rule.reagents.indexOf("LiAlH4") > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).esterToAlcoholReverse()
                            }
                            break
                    }
                }
            )
            break

        case "alkene":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "ketone":
                        case "aldehyde":
                        case "carboxylic acid":
                            if ((rule.reagents.indexOf("KMnO4") > -1 &&  rule.reagents.indexOf("H+") > -1) || (rule.reagents.indexOf("(CH3)2S") > -1 &&  rule.reagents.indexOf("O3") > -1)) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceCarboxylOxygenWithCR()
                            }
                            break
                        case "epoxide":
                            if (rule.reagents.indexOf("peroxy acid")>-1 ) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render ).replaceEpoxideOxygenWithDoubleBond()
                            }
                            break
                        case "amide":
                            if (rule.catalyst === "H2SO4" && rule.reagents.indexOf("nitrile") > -1 ) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).alkeneToAmideReverse()
                            }
                            break
                    }
                }
            )
            break


        case "terminal alkene":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "methyl ketone":
                            if (
                                (rule.catalyst.indexOf("CuCl2") > -1 && (rule.reagents.indexOf("O2") > -1 && rule.reagents.indexOf("H2O") > -1))
                                ||(rule.catalyst.indexOf("PdCl2") && (rule.reagents.indexOf("O2") > -1 && rule.reagents.indexOf("H2O") > -1))
                                || (rule.reagents.indexOf("dimethylformamide") > -1 && rule.reagents.indexOf("p-b Benzoquinone") > -1)) {

                                WackerOxidation(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err)->reverse()
                            }
                            break
                    }
                }
            )
            break

        case "aldehyde":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "primary amine":

                            if ((rule.catalyst.indexOf("heat") && rule.reagents.indexOf("ammonium formate")>-1)
                                || rule.reagents.indexOf("formamide")>-1){
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).aldehydeToPrimaryAmineReverse()
                            }

                            if (rule.catalyst.indexOf("-H2O") && ((rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH4") > -1) || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaCNBH3") > -1) || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH(OAc)3") > -1))) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).aldehydeToPrimaryAmineReverse()


                            }
                            break
                        case "secondary amine":
                            if (rule.catalyst.indexOf("-H2O") && ((rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH4")>-1)
                                || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaCNBH3") > -1) || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH(OAc)3") > -1))) {

                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).aldehydeToSecondaryAmineReverse()
                            }
                            break
                        case "tertiary amine":
                            if (rule.catalyst.indexOf("-H2O") > -1 && ((rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH4")>-1)
                                || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaCNBH3") > -1)
                                || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH(OAc)3" )>-1))) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).aldehydeToTertiaryAmineReverse()

                            }
                            break
                    }
                }
            )
            break

        case "ketone":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "primary amine":
                            if (rule.catalyst.indexOf("heat ") > -1 && (rule.reagents.indexOf("ammonium formate") > -1)){
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).ketoneToPrimaryAmineReverse()
                            }
                            break
                        case "secondary amine":
                            if (rule.catalyst.indexOf("Al/Hg") > -1&& (rule.reagents.indexOf('CH3NH2') > -1 && rule.reagents.indexOf('H2O')>-1)){
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).reductiveAminationReverse()
                            }
                            if (rule.catalyst.indexOf("heat") > -1 && (rule.reagents.indexOf("N-Methylformamide")>-1)){
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).reductiveAminationReverse()
                            }
                            if ((rule.catalyst.indexOf("-H2O") > -1 && (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaCNBH3") >-1) || (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH4") -1) || (rule.reagents.indexOf("NaBH(OAc)3") > -1))) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).reductiveAminationReverse()
                            }
                            break

                        case "tertiary amine":

                            if ((rule.catalyst.indexOf("-H2O") && (rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaCNBH3") > -1)
                                || rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH4")> -1)
                                || rule.reagents.indexOf("NR") > -1 && rule.reagents.indexOf("NaBH(OAc)3")>-1) {
                                CanonicalSMILESParserV2(substrate_JSON_object, db, rule, child_reaction_as_string, render).ketoneToTertiaryAmineReverse()
                            }
                            break
                    }

                }
            )
            break

        case "benzene":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=>{
                    switch(functional_group) {
                        case "akyl benzene":
                            if (rule.catalyst.indexOf("Pd/C") && rule.reagents.indexOf("acid chloride") > -1
                                && rule.reagents.indexOf("AlCl3") > -1 && rule.reagents.indexOf("H2") > -1) {
                                // CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("N","NO")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).akylBenzeneToBenzene("N","NO")

                            }
                            break
                        case "aryl amine":
                            if (end_product_JSON_object.functional_groups.indexOf("nitro")){
                                if (rule.catalyst.indexOf("H+") && rule.reagents.indexOf("SnCl2")) {
                                    //   CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("N","NO")
                                    CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).arylAmineToBenzene("N","NO")

                                }
                            }
                            break
                        case "benzene":
                            if (end_product_JSON_object.functional_groups.length ===1 && rule.reagents.indexOf("HNO3") > -1 && rule.reagents.indexOf("H2SO4") > -1) {
                                //    CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("N","")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).benzeneToBenzene("N","")

                            }
                            if (end_product_JSON_object.functional_groups.length ===1 && rule.reagents.indexOf("Br2") > -1 && rule.reagents.indexOf("FeBr3") > -1) {
                                // CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("Br","")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).benzeneToBenzeneBr("Br","")

                            }
                            if (end_product_JSON_object.functional_groups.length ===1 && rule.reagents.indexOf("Cl2") > -1 && rule.reagents.indexOf("FeCl3") > -1) {
                                //   CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("Cl","")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).benzeneToBenzeneCl("Cl","")

                            }
                            if (end_product_JSON_object.functional_groups.length ===1 && rule.reagents.indexOf("SO3") > -1 && rule.reagents.indexOf("H2SO4") > -1) {
                                //   CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("S","")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).benzeneToBenzeneS("S","")

                            }
                            break
                    }
                }
            )
            break

        case "primary amine":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=>{
                    switch(functional_group) {
                        case "secondary amine":
                        case "tertiary amine":
                            if (rule.catalyst.indexOf("Ag/TsiO2") > -1 && rule.reagents.indexOf("CH3OH") > -1) {
                                //      CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("NC","N")
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).tertiaryAmineToPrimaryAmine("NC","N")

                            }
                            break
                    }
                }
            )
            break


        case "halogenoalkane":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "primary amine":
                        case "tertiary amine":
                            //   CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("N","X")
                            CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).tertiaryAmineToHalogenalkane()

                            break
                    }
                }
            )


        case "nitrile":
            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "primary amine":
                            // CanonicalSMILESParserV2(end_product_JSON_object, db, rule, render, Err).replaceSingleAtom("N","#N")
                            CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).primaryAmineToNitrile("N","#N")

                            break
                    }
                }
            )
            break


        case "carboxylate ester":

            end_product_JSON_object.functional_groups.map(
                (functional_group)=> {
                    switch (functional_group) {
                        case "carboxylic salt":
                            if (rule.reagents.indexOf("NaOH") > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceORGroupOnCarboxylCarbonWithOCation()
                            }
                            break

                        case "carboxylic acid":
                            if (rule.catalyst = "H+" && rule.reagents.indexOf("H2O") > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceORGroupOnCarboxylCarbonWithOH()
                            }
                            break
                    }
                }
            )

            break

        case "akyl halide":
        case "AKYL HALIDE":

            end_product_JSON_object.functional_groups.map(
                (functional_group) => {
                    switch (functional_group) {

                        case "primary amine":
                            if ((rule.catalyst = "H2O" && rule.reagents.indexOf("NaN3")) || (rule.reagents.indexOf("potassium phthalimide") > -1)) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceHalideWithNH2Reverse()
                            }
                            break

                        case "secondary amine":
                            /*
                            “description”:”Halide is substituted for NH2 to form a primary amine. Then one of the hydrogens on the nitrogen is substituted for a methyl group to form a secondary amine.”
                            */
                            if ((rule.reagents.indexOf("ammonia")) || (rule.reagents.indexOf("OH-") > -1)) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceHalideWithNCReverse()
                            }
                            break


                        case "aromatic hydrocarbon":
                            if (rule.reagents.indexOf("HCl") && rule.reagents.indexOf("Aluminum") > -1) {
                                CanonicalSMILESParserV2(end_product_JSON_object, db, rule, child_reaction_as_string, render, Err).replaceHydrogenWithHalideReverse()
                            }
                            break
                    }
                }
            )
    }

}


module.exports = FindSubstrates











