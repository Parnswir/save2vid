'use strict';

var _ = require('lodash');
var config = require('config');

var logger = require('./logger');
var FileReader = require("./eu/ParadoxFileReader");
var Definitions = require("./eu/Definitions");
var Map = require('./eu/Map');

if(process.argv.length > 2) {
    logger.info('Using resources from base path ', config.EU4_PATH);

    Promise.resolve()
        .then(function () {
            return Definitions.fromFile(config.EU4_PATH + '/map/definition.csv');
        })
        .then(function (definitions) {
            logger.info('Definitions: ', definitions);
            return new Map().getData(config.EU4_PATH + '/map/provinces.bmp');
        })
        .then(function (data) {
            logger.info(data);
        })
        .then(function () {
            FileReader.fromFile(process.argv[2], function(err, file) {
                if(err) {
                    console.log("Error: " + err);
                } else {
                    console.log(file);

                    //Province file:
                    //console.log(save.root.elements['1436.4.28'].elements);

                    //Savegame provinces:
                    //_.forEach(save.root.elements.provinces.elements, function (province) {
                    //    console.log(province.name, province.elements.owner);
                    //});
                }
            });
        })
        .catch(function (err) {
            logger.error(err);
        });
} else {
    console.log("Provide (unzipped) .eu4 file as first parameter");
}
