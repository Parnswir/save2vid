'use strict';

var path = require('path');
var _ = require('lodash');

var FileReader = require('./ParadoxFileReader');
var Color = require('./Color');

var Country = function(tag, name, color) {
    this.tag = tag;
    this.name = name;
    this.color = color;
};

var CountryFactory = function () {};

module.exports = {
    Country: Country,
    CountryFactory: CountryFactory
};

CountryFactory.prototype.fromFile = function (tag, filePath) {
    return FileReader.fromFile(filePath)
        .then(function (countryFile) {
            return new Country(tag, path.basename(filePath, '.txt'), new Color(countryFile.root.color));
        });
};
