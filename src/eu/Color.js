'use strict';

var _ = require('lodash');

var Color = function (args) {
    if (_.isArray(args) && args.length === 3) {
        init(this, args[0], args[1], args[2]);
    } else if (args.red && args.green && args.blue) {
        init(this, args.red, args.green, args.blue);
    } else {
        throw Error('Not a color: ' + args);
    }
};

function init(color, red, green, blue) {
    color.red = parseInt(red);
    color.green = parseInt(green);
    color.blue = parseInt(blue);
}

module.exports = Color;
