'use strict';

var _ = require('lodash');
var config = require('config');

var logger = require('./logger');
var FileReader = require("./eu/ParadoxFileReader");
var Definitions = require("./eu/Definitions");
var Map = require('./eu/Map');
var Color = require('./eu/Color');

if(process.argv.length > 2) {
    logger.info('Using resources from base path ', config.EU4_PATH);

    var provinces = {};

    Promise.resolve()
        .then(function () {
            return Definitions.fromFile(config.EU4_PATH + '/map/definition.csv');
        })
        .then(function (definitions) {
            _.forEach(definitions, function (definition) {
                provinces[_.get(definition, 'province')] = new Color(definition);
            });
            logger.info('Loading and resizing map');
            return new Map(1280).fromFile(config.EU4_PATH + '/map/provinces.bmp');
        })
        .then(function (map) {
            logger.info('Building province mapping');
            return map.buildProvinceMapping(provinces);
        })
        .then(function (map) {
            logger.info('Parsing save file');
            return FileReader.fromFile(process.argv[2])
                .then(function (save) {
                    logger.info('Building history');
                    var historyMapping = {};
                    var date = /\d+\.\d+\.\d+/gi;
                    _.forEach(save.root.provinces, function (province) {
                        let historySection = province.history;
                        if (historySection && historySection) {
                            let history = historySection;
                            _.forEach(historySection.$insertionOrder, function (key) {
                                if (key.match(date)) {
                                    let events = history[key];
                                    let owner = _.get(events, 'owner');
                                    if (owner) {
                                        let values = _.get(historyMapping, key, []);
                                        values.push({id: Math.abs(province.$name), owner: owner});
                                        historyMapping[key] = values;
                                    }
                                }
                            });
                        }
                    });
                    console.log(historyMapping);
                });
        })
        .catch(function (err) {
            logger.error(err);
        });
} else {
    console.log("Provide (unzipped) .eu4 file as first parameter");
}
