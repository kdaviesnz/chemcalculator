const micromatch = require('micromatch');
const cparser = require('./lib/CanonicalSMILESParser')

console.log(micromatch(['foo', 'bar', 'baz', 'qux'], ['f*', 'b*'])) //=> ['foo', 'bar', 'baz']
console.log(micromatch(['foo', 'bar', 'baz', 'qux'], ['*', '!b*'])) //=> ['foo', 'qux']

console.log(micromatch('NC(=0)C', '*=0*'));

var parse = require('parenthesis')

// Parse into nested format
console.log(parse('CC(CC1=CC=CC=C1)NC'))
// [ 'CC(', [ 'CC1=CC=CC=C1' ], ')NC' ]

console.log(parse('CC(CC1=CC=CC=C1)NC', {
    brackets: ['()'],
    escape: '\\',
    flat: true
}))
// [ 'CC(\\1\\)NC', 'CC1=CC=CC=C1' ]

console.log(parse('CC(CC1=CC=CC=C1)NC', {
    brackets: ['()'],
    escape: '\\',
    flat: false
}))
// [ 'CC(', [ 'CC1=CC=CC=C1' ], ')NC' ]

console.log(cparser('CC(CC1=CC=CC=C1)NC'))