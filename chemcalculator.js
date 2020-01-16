// chemcalculator.js
// @see https://nodejs.org/api/readline.html
// @see https://www.npmjs.com/package/smiles
// @see https://www.npmjs.com/package/chemical-formula
// @see https://www.npmjs.com/package/chemical-symbols
// @see https://www.npmjs.com/package/molecular-formula
// @see https://www.npmjs.com/package/@chemistry/elements
// @see https://www.npmjs.com/package/pubchem-access
// @see http://mmmalik.github.io/pubchem-access/

const symbols = require('chemical-symbols');
const chemicalFormula = require('chemical-formula')
const molFormula = require('molecular-formula')
const elements = require('@chemistry/elements')
const pubchem = require("pubchem-access").domain("compound");
const uniqid = require('uniqid');

const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const help = () => {
    console.log("Show compound data by name:")
    console.log("[Compound name] -n")
    console.log("Show compound data by SMILES:")
    console.log("[SMILE] -s")
    console.log("Find component compounds")
    console.log("[Compound name] -n /")
    console.log("[SMILE] -s /")
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'ChemCalc > '
});

const Canonical_SMILESParser = require("./lib/CanonicalSMILESParser")
const MoleculeLookup = require('./lib/MoleculeLookup.js')
const ArrheniusAcidicReaction = require('./lib/reactions/ArrheniusAcidicReaction.js')
const ArrheniusBaseReaction = require('./lib/reactions/ArrheniusBaseReaction.js')


const toJson = (SMILE, compound) => {
    console.log(compound)
    console.log(SMILE)
    tokens = Canonical_SMILESParser(SMILE)
    console.log(tokens)
    const compound_obj = {
        "name" : compound,
        "SMILE": SMILE,
        atoms: tokens.map(
            (token, index, arr) => {
                console.log(token)

                if (token.type == 'AliphaticOrganic') {
                    const element = elements.Element.getElementByName(token.value)
                }
                return [token.type, token.value, element]
            })
    }
    console.log(compound_obj)
}

const getBranchesRecursive = (SMILES, branch_id) => {

    SMILESasArray = SMILES.split("")

    // Here we want get an array of documents where each document has a trunk property and a branches property.
    // Each trunk property will be a SMILES with {{}}
    // The branches property will be a collection of documents with trunk and branches properties.

    let depth = 0;

    const branches = SMILESasArray.reduce(

        (built_branches, current_value, current_index, SMILESasArray ) => {

            if (current_value === ")") {

                current_branch = built_branches["branches"][built_branches["branches"].length-1]

                if (depth > 1) {
                    current_branch["trunk"] += current_value
                }

                current_branch["smiles"] = current_branch["trunk"]

                if (depth === 1) {
                    const branch_id= uniqid()
                    current_branch["trunk"] += `{{${branch_id}}`
                    current_branch["branches"] = getBranchesRecursive(current_branch["smiles"], branch_id)
                }

                // End the branch
                depth = depth - 1;


            } else if (depth > 0) {

                if (built_branches["branches"].length === 0) {
                    built_branches.branches.push(
                        {trunk:current_value, branches:[]}
                    )
                } else {
                    built_branches["branches"][built_branches["branches"].length-1]["trunk"] += current_value;
                }

                if (current_value==="(") {
                    depth++;
                }

            } else if(depth === 0) {

                if (current_value === "(") {
                    depth++;
                } else {
                    built_branches.trunk += current_value
                }

            }

            return built_branches

        },
        {
            smiles: SMILES,
            trunk: "",
            branches:[],
            _id: branch_id
        }

    );


    return branches

}


const checkDBForCompoundByName = (name, db, callback) => {
    db.collection('compounds').findOne({"properties.names":name}, function(findErr, SMILES_doc) {

        if (findErr) {
            throw findErr;
        }

        callback(SMILES_doc)

    })
}

const checkDBForCompound = (SMILES, db, callback) => {

    db.collection('compounds').findOne({"smiles":SMILES}, function(findErr, SMILES_doc) {

        if (findErr) {
            throw findErr;
        }

        callback(SMILES_doc)

    })
}

const getChildCompounds = (data, db, client, rl) => {


    const SMILES_doc = getBranchesRecursive(data['CanonicalSMILES'])

    SMILES_doc["properties"] = data

    // Add record to mongodb
    db.collection('compounds').insertOne(SMILES_doc, function (insertErr, result) {
        if (insertErr) throw insertErr;
        client.close()

    })

    // We now have a compound wth branches where each branch has a SMILES and trunk property.
    // The next step is to get every combination of branches that make up the compound
    // @todo
    // @see branchestesting.js

    console.log(JSON.stringify(SMILES_doc, null, 2))

    rl.prompt()

}

rl.prompt()

// https://stackoverflow.com/questions/47662220/db-collection-is-not-a-function-when-using-mongoclient-v3-0
MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true}, function (err, client) {

        assert.equal(err, null);
        const db = client.db('chemistry');

    rl.on('line', (line) => {

            const lineTrimmed = line.trim();
            switch (lineTrimmed) {
                case "help":
                    help()
                    rl.prompt();
                    break;
                default:
                    const tokens = lineTrimmed.split(' ')
                    console.log("tokens:")
                    console.log(tokens)
                    if (tokens.length < 2) {
                        help()
                        rl.prompt();
                    } else if (tokens[1]==="+") {

                        /*
    ChemCalc > HNO3 + H2O
    tokens:
    [ 'HNO3', '+', 'H2O' ]
     */
                        MoleculeLookup(db, tokens[0]).then(
                            // "resolves" callback
                            (first_molecule_JSON_object) => {

                                if (undefined === tokens[2]) {
                                    ArrheniusBaseReaction(potassium_hydroxide)
                                } else {
                                    MoleculeLookup(db, tokens[2]).then(
                                        // "resolves" callback
                                        (second_molecule_JSON_object) => {
                                            ArrheniusAcidicReaction(first_molecule_JSON_object, second_molecule_JSON_object)
                                        },
                                        // "rejects" callback
                                        (Err) => {
                                            console.error(new Error("Cannot load second molecule"))
                                        }
                                    )
                                }

                            },
                            // "rejects" callback
                            (Err) => {
                                console.error(new Error("Cannot load first molecule"))
                            }
                        )
                    } else {

                        const type = tokens[1].split('')

                        const properties = ["IUPACName", "MolecularFormula", "MolecularWeight",
                            "CanonicalSMILES", "IsomericSMILES", "InChI", "InChIKey",
                            "XLogP", "ExactMass", "MonoisotopicMass", "TPSA",
                            "Complexity", "Charge", "HBondDonorCount", "HBondAcceptorCount",
                            "RotatableBondCount", "HeavyAtomCount", "IsotopeAtomCount", "AtomStereoCount",
                            "DefinedAtomStereoCount", "UndefinedAtomStereoCount", "BondStereoCount", "DefinedBondStereoCount",
                            "UndefinedBondStereoCount", "CovalentUnitCount", "Volume3D", "XStericQuadrupole3D",
                            "YStericQuadrupole3D", "ZStericQuadrupole3D", "FeatureCount3D", "FeatureAcceptorCount3D",
                            "FeatureDonorCount3D", "FeatureAnionCount3D", "FeatureCationCount3D", "FeatureRingCount3D",
                            "FeatureHydrophobeCount3D", "ConformerModelRMSD3D", "EffectiveRotorCount3D", "ConformerCount3D",
                            "Fingerprint2D"]



                        switch (type[1]) {


                            case 'n': // getting compound by name

                                const compound_name = tokens[0]

                                checkDBForCompoundByName(compound_name, db, (SMILES_doc) => {

                                    // DB compound record found
                                    if (SMILES_doc !== null) {
                                        console.log(SMILES_doc);
                                        client.close()
                                        rl.prompt()
                                    } else {
                                        // Do a pubchem lookup
                                        pubchem
                                            .setName(compound_name)
                                            .getProperties(properties)
                                            .execute(function (data, status) {

                                                if (data === undefined || !data) {
                                                    help()
                                                    rl.prompt()
                                                } else {

                                                    // http://mmmalik.github.io/pubchem-access/
                                                    pubchem
                                                        .setCid(data['CID'])
                                                        .getNames(20)
                                                        .execute(function (names_data, status) {

                                                            // if we're here then we don't have a compound record.
                                                            // data is all pubchem data.
                                                            data["names"] = names_data

                                                            if (tokens[2] == "/") {
                                                                getChildCompounds(data, db, client, rl)
                                                            } else {
                                                                toJson(data['CanonicalSMILES'], compound)
                                                                rl.prompt()
                                                            }

                                                        });

                                                }

                                            })
                                    }
                                })
                                break

                            case 's':

                                const SMILES = tokens[0]

                                checkDBForCompound(SMILES, db, (SMILES_doc) => {

                                    // DB compound record found
                                    if (SMILES_doc !== null) {
                                        console.log(SMILES_doc);
                                        client.close()
                                        rl.prompt()
                                    } else {

                                        pubchem
                                            .setSmiles(SMILES)
                                            .getProperties(properties)
                                            .execute(function (data, status) {
                                                if (data === undefined || !data) {
                                                    help()
                                                    rl.prompt()
                                                } else {

                                                    // http://mmmalik.github.io/pubchem-access/
                                                    pubchem
                                                        .setCid(data['CID'])
                                                        .getNames(20)
                                                        .execute(function (names_data, status) {

                                                            // if we're here then we don't have a compound record.
                                                            // data is all pubchem data.
                                                            data["names"] = names_data

                                                            if (tokens[2] == "/") {
                                                                getChildCompounds(data, db, client, rl)
                                                            } else {
                                                                toJson(SMILES, data[0])

                                                                rl.prompt()
                                                            }

                                                        });
                                                }
                                            });

                                    }

                                })
                                break;
                            default:
                                help()
                                rl.prompt()
                        }

                    }

                /*
                console.log(elements.Element.getElementById(1));
                console.log(elements.Element.getElementByName('C'));
                const water = new molFormula('H2O')
                console.log(water.getComposition())
                water.subtract({'H':1})
                console.log(water.getSimplifiedFormula())
                water.add({"H":1})
                console.log(water.getSimplifiedFormula())
                console.log(symbols)
                console.log(chemicalFormula('HOCH2CH2OH'))
                */

            }


        }).on('close', () => {
            console.log('Have a great day!');
            process.exit(0);
        });

    }
)

