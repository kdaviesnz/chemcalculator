// AtomsFactory test
// #cd /Applications/MAMP/htdocs/chemcalculator
// #node AtomsFactoryTest.js

const AtomsFactory = require("../lib/factories/AtomsFactory")

// acetone
atoms = AtomsFactory("CC(=O)C");
console.log(atoms)
console.log(atoms[0])

// mdma
//console.log(AtomsFactory("CC(CC1=CC2=C(C=C1)OCO2)NC"))

//DMT
//console.log(AtomsFactory("CC(C)N(C(C)C)P(OCCC#N)OC1CC(OC1COC(C2=CC=CC=C2)(C3=CC=C(C=C3)OC)C4=CC=C(C=C4)OC)N5C=CC(=O)NC5=O"))