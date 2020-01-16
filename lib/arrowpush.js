const arrowPush = (Molecule, SourceAtom, TargetAtom) => {

    const sourceAtomPushed = SourceAtom.clone(SourceAtom.electrons.slice(0, SourceAtom.electrons.length-1))
    const targetAtomPushed= TargetAtom.clone(TargetAtom.electrons.push(electron))


    return moleculePushed

}