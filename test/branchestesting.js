const uniqid = require('uniqid')
const range = require("range")

const parts = [
    'CC',
    '{{123}}',
    'NC'
]

const combineBranches = (parts, start_position, step)=> {
    return (result, current, index) => {
        const combined_branch = parts.slice(current + start_position, current + start_position + step).join("") // combined branch
        result.push(combined_branch)
        return result
    }
}

const branch_sets = range.range(2,parts.length+1, 1).reduce((combination_sets_partial, step, step_index)=>{

    // shifting
    const combinations_step_sets = parts.reduce((combinations_step_sets_partial, part, start_position) => {

        const combinations = range.range(0, parts.length,step,1).reduce(combineBranches(parts,start_position, step),[]).filter((branch)=>{
            return branch !== ""
        })

        const combinations_w_single_parts = [
            ...parts.slice(0,start_position),
            ...combinations
        ]

        combinations_step_sets_partial.push(combinations_w_single_parts)
        return combinations_step_sets_partial

    }, [])

    combinations_step_sets.map((set)=>{
        if (!(set in combination_sets_partial)) {
            combination_sets_partial.push(set)
        }
    })
    return combination_sets_partial

},[]).filter((set, index, arr)=>{
    return !(set in arr)
})

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
                    built_branches.trunk += `{{${branch_id}}`
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

//console.log('Branch sets')
//console.log(branch_sets)
const main = getBranchesRecursive("CC(CCO)NC", uniqid())
console.log(main)
console.log(main.branches)
