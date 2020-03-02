const AtomsToSMILES = (molecule_json_object) => {

    // const t = smiles.parse('C1OC2=C(O1)C=C(C=C2)CC(=O)O')
    
    const normalizeSMILES = () => {
        return molecule_json_object.CanonicalSMILES
    }


    return {
        functionalGroups: functionalGroups,
        functionalGroupsList: functionalGroupsList

    }

}

module.exports = AtomsToSMILES











