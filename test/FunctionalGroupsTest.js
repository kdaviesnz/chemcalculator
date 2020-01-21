const should = require('should');
const FunctionalGroups = require('../lib/FunctionalGroups')

const FunctionalGroupsTest = () => {

    /*
    [ [ 'C,CCC1=CC2=C(C=C1)OCO2C', 'CCC1=CC2=C(C=C1)OCO2' ] ]
[ [ 'C', 'CCC1=CC2=C(C=C1)OCO2' ],
  [ [ 'C,CCC1=CC2=C(C=C1)OCO2C', 'CCC1=CC2=C(C=C1)OCO2' ] ] ]

     */
    const safrole_alkene = {
        "CanonicalSMILES":"C=CCC1=CC2=C(C=C1)OCO2"
    }
    const sfg = FunctionalGroups(safrole_alkene).functionalGroups.alkene
    console.log(sfg)
    sfg[0][0].should.be.equal('C')
    sfg[0][1].should.be.equal('CCC1=CC2=C(C=C1)OCO2')
    process.exit()

// methyl ketone (methyl piperonal ketone)
    const mk = {
        "CanonicalSMILES":'CC(=O)CC1=CC2=C(C=C1)OCO2'
    }

    const mkfg = FunctionalGroups(mk).functionalGroups.methyl_ketone

    console.log(mkfg)
    process.exit()
    mkfg[2].should.be.equal('C')

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




}

FunctionalGroupsTest()















