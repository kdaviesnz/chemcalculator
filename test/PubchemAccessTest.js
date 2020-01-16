const should = require('should');
const PubChemLookup = require('../lib/PubChemLookup')

const PubchemAccessTest = () => {


// https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastsimilarity_2d/cid/2244/property/MolecularWeight,MolecularFormula,RotatableBondCount/JSON?Threshold=10

// https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastsubstructure/cid/2244/property/MolecularWeight,MolecularFormula,RotatableBondCount/JSON?Threshold=10

    const MongoClient = require('mongodb').MongoClient
    const S = require('string');

    MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true},
        function (err, client) {

            if (err) {
                console.log(err)
                process.exit()
            }
            const db = client.db('chemistry');

            const pkl = PubChemLookup((err, search, body) => {
                console.log("There was an error searching PubChem")
                console.log(search)
                console.log(body)
                process.exit()
            })

// "CC(CC1=CC2=C(C=C1)OCO2)NC"
            // CC(=O)OC1C=CC2C3CC4=C5C2(C1OC5=C(C=C4)OC(=O)C)CCN3C
            // CC(CC1=CC=CC=C1)NC
            //  'CC(=O)CC1=CC2=C(C=C1)OCO2'
            const search = "CC(=O)CC1=CC2=C(C=C1)OCO2" // Methyl piperonyl ketone

            if (false) {
                pkl.searchBySMILES(search, db, (molecule) => {
                    if (molecule.CID !== 0) {
                        // Check if molecule already in db and if it isn't then save to db
                        db.collection('molecules').findOne(
                            {CID: molecule.CID},
                            function (err, molecule_in_mongo) {
                                if (null === molecule_in_mongo) {
                                    molecule.tags = [search]
                                    db.collection("molecules").insertOne(molecule, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log('Added ' + molecule.IUPACName + ' to mongodb')
                                        }
                                    })
                                }
                            }
                        )
                    } else {
                        console.log('Molecule not found in pubchem - ' + search)
                    }
                })
            }

// "CC(CC1=CC2=C(C=C1)OCO2)NC"
            // CC(=O)OC1C=CC2C3CC4=C5C2(C1OC5=C(C=C4)OC(=O)C)CCN3C
            // CC(CC1=CC=CC=C1)NC
            //  'CC(=O)CC1=CC2=C(C=C1)OCO2'

            if (true) {
                console.log('Finding substructures for ' + search)

                pkl.FetchSubstructuresBySMILES(search, db, (molecule, db, child_SMILES) => {
                    // Check if molecule already in db and if it isn't then save to db
                    if (molecule.children === undefined) {
                        molecule.children = [child_SMILES]
                    } else {
                        molecule.children.push(child_SMILES)
                    }

                    if (molecule.CID !== 0) {
                        db.collection('molecules').findOne(
                            {CID: molecule.CID},
                            function (err, molecule_in_mongo) {
                                if (null === molecule_in_mongo) {
                                    db.collection("molecules").insertOne(molecule, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log('Added ' + molecule.IUPACName + ' to mongo')
                                        }
                                    })
                                }
                            }
                        )
                    }
                })

            }

        }
    )


// https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/substructure/smiles/C1CCCCCC1/JSON

    //  https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/4259660642877971402/cids/JSON

    //    https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/substructure/cid/1615/JSON

}

PubchemAccessTest()













