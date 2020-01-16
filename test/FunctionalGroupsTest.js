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

    //!terminal alkene (safrole)
const safrole = {
       "CanonicalSMILES":'C=CCC1=CC2=C(C=C1)OCO2'
   }

   const safrolefg = FunctionalGroups(safrole).functionalGroups.terminal_alkene
   // console.log(g)
   safrolefg[0].should.be.equal('C=CCC1=CC2=C(C=C1)OCO2')
   
}


// methyl ketone (methyl piperonal ketone)
const mk = {
       "CanonicalSMILES":'CC(=O)CC1=CC2=C(C=C1)OCO2'
   }

   const mkfg = FunctionalGroups(mk).functionalGroups.terminal_alkene
   // console.log(g)
   mkfg[0].should.be.equal('O')

    
}

FunctionalGroupsTest()















