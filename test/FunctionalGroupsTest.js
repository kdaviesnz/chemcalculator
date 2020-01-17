const should = require('should');
const FunctionalGroups = require('../lib/FunctionalGroups')

const FunctionalGroupsTest = () => {


    //!terminal alkene (safrole)
    const safrole = {
        "CanonicalSMILES":'C=CCC1=CC2=C(C=C1)OCO2'
    }

    const safrolefg = FunctionalGroups(safrole).functionalGroups.terminal_alkene
    safrolefg[0].should.be.equal('C=CCC1=CC2=C(C=C1)OCO2')

    const s = {
        "CanonicalSMILES":'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
    }

   // glycol
    // CC(C(C1=CC2=C(C=C1)OCO2)O)O
    const g = FunctionalGroups(s).functionalGroups.glycol
    g[0].should.be.equal('C')
    g[1].should.be.equal('')
    g[2].should.be.equal('C1=CC2=C(C=C1)OCO2')
    g[3].should.be.equal('')


// methyl ketone (methyl piperonal ketone)
    const mk = {
        "CanonicalSMILES":'CC(=O)CC1=CC2=C(C=C1)OCO2'
    }

    const mkfg = FunctionalGroups(mk)
    console.log(mkfg)
    process.exit()
    mkfg[0].should.be.equal('O')


}

FunctionalGroupsTest()















