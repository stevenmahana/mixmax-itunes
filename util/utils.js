var _ = require('underscore');

module.exports = {
    meKey: '123456',
    randomActs: function() {
        // add external source for acts
        var randomActAry = [
            'bruno+mars',
            'jack+johnson',
            'drake',
            'rihanna',
            'adele',
            'ariana+grande',
            'shawn+mendes',
            'chainsmokers'
        ];

        return _.sample(randomActAry)
    },
    isInteger: function(x) {
        return (typeof x === 'number') && (x % 1 === 0);
    }
};
