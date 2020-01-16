const ReactionFactory= (reactants, type, react)=>{

    // react should be a closure containing the reactants so we don’t change the original molecule
    const products = react()

    return {
        reactants: reactants,
        products: products,
        type: type
    }
}

module.exports = ReactionFactory

