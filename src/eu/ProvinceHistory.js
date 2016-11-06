'use strict';

var path = require('path');
var fs = require('fs');

var FileReader = require('./ParadoxFileReader');

var Province = function(id, owner) {
    this.id = id;
    this.owner = owner;
};

var ProvinceFactory = function () {};

module.exports = {
    Province: Province,
    ProvinceFactory: ProvinceFactory
};

var ID_REGEXP = new RegExp('(\\d+)', 'g');

ProvinceFactory.prototype.fromFile = function (filePath) {
    let id = path.basename(filePath).match(ID_REGEXP)[0];
    return FileReader.fromFile(filePath)
        .then(function (provinceFile) {
            let owner = provinceFile.root.owner;
            return new Province(id, owner || 'NAT');
        });
};

ProvinceFactory.prototype.all = function (directory) {
    let self = this;
    return Promise.resolve()
        .then(function () {
            let files = fs.readdirSync(directory);
            let promises = files.map(function (file) {
                let filePath = path.resolve(directory, file);
                return self.fromFile(filePath);
            });
            return Promise.all(promises);
        });
};
