require("dotenv").config()
const should = require('should');
const MoleculeLookup = require('../lib/MoleculeLookup')

const MoleculeLookupTest = () => {


    const MongoClient = require('mongodb').MongoClient
    const S = require('string');

    MongoClient.connect('mongodb+srv://kevin:!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true},
        function (err, client) {

            if (err) {
                console.log(err)
                process.exit()
            }
            const db = client.db('chemistry');

// "CC(CC1=CC2=C(C=C1)OCO2)NC"
            // CC(=O)OC1C=CC2C3CC4=C5C2(C1OC5=C(C=C4)OC(=O)C)CCN3C
            // CC(CC1=CC=CC=C1)NC
            //  'CC(=O)CC1=CC2=C(C=C1)OCO2'
            //const search = "CC(=O)CC1=CC2=C(C=C1)OCO2"
            // const search = "CC(=O)CC1=CC2=C(C=C1)OCO2"
            const search = "O(CO)(CC1=CC2=C(C=C1)OCO2)(C).*" // isosafrole glcol

            if (true) {

                console.log("Looking up O(C(=O)CC1=CC2=C(C=C1)OCO2)C(=O)CC1=CC2=C(C=C1)OCO2 ")
                MoleculeLookup(db, "O(C(=O)CC1=CC2=C(C=C1)OCO2)C(=O)CC1=CC2=C(C=C1)OCO2", "SMILES", true).then(
                    (mol) => {
                        console.log(mol)
                        if (typeof mol === "object") {
                            mol.map(
                                (molecule) => {
                                    console.log('Processed ')
                                    console.log(molecule.IUPACName)
                                }
                            )

                        } else {
                            console.log('Processed ')
                            console.log(mol.IUPACName)
                        }
                    }
                )

            }

            if (false) {
                MoleculeLookup(db, "methamphetamine", "name", true).then(
                    (mol) => {
                        console.log('Processed ')
                        console.log(mol.IUPACName)
                    }
                )
            }

            if (false) {
                console.log('Looking up CC(CC1=CC2=C(C=C1O)OCO2)NC')
                MoleculeLookup(db, "CC(CC1=CC2=C(C=C1O)OCO2)NC", "SMILES", true).then(
                    (mol) => {
                        console.log('Processed ')
                        console.log(mol.IUPACName)
                    }
                )
            }

            if (false) {

                console.log("Looking up CN.* ")
                MoleculeLookup(db, "CN.*", "SMILES", true).then(
                    (mol) => {
                        console.log(mol)
                        if (typeof mol === "object") {
                            mol.map(
                                (molecule) => {
                                    console.log('Processed ')
                                    console.log(molecule.IUPACName)
                                }
                            )

                        } else {
                            console.log('Processed ')
                            console.log(mol.IUPACName)
                        }
                    }
                )

            }

        }
    )


}

MoleculeLookupTest()












