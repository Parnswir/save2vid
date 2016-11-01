'use strict';

var fs = require('fs');
var bmp = require('bmp-js');

var Map = function () {};

module.exports = Map;

Map.prototype.getData = function (path) {
    return new Promise(function (resolve, reject) {
        try {
            let buffer = fs.readFileSync(path);
            let data = bmp.decode(buffer).data;
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
};
