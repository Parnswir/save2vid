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

ProvinceFactory.PLACEHOLDER_SEA = '$SEA$';
ProvinceFactory.PLACEHOLDER_WASTELAND = '$WASTELAND$';

var ID_REGEXP = new RegExp('(\\d+)', 'g');

ProvinceFactory.prototype.fromFile = function (filePath) {
    let id = path.basename(filePath).match(ID_REGEXP)[0];
    return FileReader.fromFile(filePath)
        .then(function (provinceFile) {
            let owner = provinceFile.root.owner;
            if (!owner && provinceFile.root['trade_goods']) {
                owner = 'NAT';
            }
            return new Province(id, owner || ProvinceFactory.PLACEHOLDER_SEA);
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

ProvinceFactory.prototype.allWastelands = function (filePath) {
    let self = this;
    return FileReader.fromFile(filePath)
        .then(function (climateFile) {
            return climateFile.root['impassable'];
        })
        .then(function (provinces) {
            return provinces.map(function (province) {
                return new Province(parseInt(province), ProvinceFactory.PLACEHOLDER_WASTELAND);
            })
        });
};
