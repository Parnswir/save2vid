'use strict';

var fs = require('fs');
var parse = require('csv-parse');

module.exports = {
    fromFile: fromFile
};

function fromFile(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err) reject(err);
            parse(data, {delimiter: ';', columns: true, relax_column_count: true}, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    });
}
