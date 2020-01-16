const should = require('should');
const MongoClient = require('mongodb').MongoClient
const MoleculeLookup = require('../lib/MoleculeLookup.js')
const Nomenclature = require('../lib/Nomenclature')

const NomenclatureTest = () => {

    MongoClient.connect('mongodb+srv://kevin:77777!@cluster0-awqh6.mongodb.net', {useNewUrlParser: true}, function (err, client) {

        const db = client.db('chemistry');

        MoleculeLookup(db, "3-methylpentane", true).then(
            // "resolves" callback
            (alkane_molecule_JSON_object) => {

                const nomenclature = Nomenclature(alkane_molecule_JSON_object)
                nomenclature.should.be.an.Object()
                nomenclature.should.have.property('calcLongestCarbonChain')

                const longest_chain = nomenclature.calcLongestCarbonChain()
                longest_chain.length.should.be.equal(5)

                const substituent_index_top_to_bottom = nomenclature.findIndexOfFirstSubstituent(longest_chain)
                substituent_index_top_to_bottom.should.be.equal(2)
                const substituent_index_bottom_to_top = nomenclature.findIndexOfFirstSubstituent(longest_chain.reverse())
                substituent_index_bottom_to_top.should.be.equal(2)

                const longest_chain_numbered = nomenclature.numberChain(longest_chain)
                longest_chain_numbered[0].should.have.property('number')
                longest_chain_numbered[0].number.should.be.equal(1)
                longest_chain_numbered[longest_chain_numbered.length-1].number.should.be.equal(longest_chain_numbered.length)

                const chain_with_subst_names = nomenclature.nameSubsituents(longest_chain_numbered)
                chain_with_subst_names[2].should.have.property("substituent_name")
                chain_with_subst_names[2].substituent_name.should.be.equal('methyl')

                const substs = nomenclature.fetchSubstituentsNamesAlphabetically(chain_with_subst_names)
                substs.should.be.String()
                substs.should.be.equal('3-methyl')

                const trunk_name = nomenclature.determineTrunkName(longest_chain)
                trunk_name.should.be.a.String()
                trunk_name.should.be.equal('pentane')

                const subst_count_map = nomenclature.substCountMap(chain_with_subst_names)
                subst_count_map.should.be.a.Object()
                subst_count_map.should.have.property('methyl')
                subst_count_map['methyl'].should.be.equal(1)

                const subst_prefixes_map = nomenclature.substPrefixesMap(chain_with_subst_names)
                subst_prefixes_map.should.be.a.Object()
                subst_prefixes_map.should.have.property('methyl')
                subst_prefixes_map['methyl'].should.be.equal("")

                const molecule_name = nomenclature.determineName()
                molecule_name.should.be.a.String()
                molecule_name.should.be.equal('3-methylpentane')

                console.log("Passed nomenclature tests")

            }
        )

    })


}

module.exports = NomenclatureTest