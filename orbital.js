const uniqid = require('uniqid');

const orbital = (shape, shell, electrons) => {
    return {
        _id: uniqid(),
        shape: shape,
        shell: shell,
        electrons : electrons
    }
}