const should = require('should');
const FunctionalGroups = require('../lib/FunctionalGroups')

const FunctionalGroupsTest = () => {

    const s = {
        "CanonicalSMILES":'CC(C(C1=CC2=C(C=C1)OCO2)O)O'
    }

// glycol
// CC(C(C1=CC2=C(C=C1)OCO2)O)O
    const g = FunctionalGroups(s).functionalGroups.glycol
    // console.log(g)
    g[0].should.be.equal('C')
    g[1].should.be.equal('')
    g[2].should.be.equal('C1=CC2=C(C=C1)OCO2')
    g[3].should.be.equal('')

}

FunctionalGroupsTest()















