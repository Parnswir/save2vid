'use strict';

var _ = require('lodash');
var config = require('config');
var path = require('path');

var logger = require('./logger');
var FileReader = require("./eu/ParadoxFileReader");
var Definitions = require("./eu/Definitions");
var Map = require('./eu/Map');
var Color = require('./eu/Color');
var HistoricalDate = require('./eu/HistoricalDate');
var CountryFactory = require('./eu/Country').CountryFactory;

if(process.argv.length > 2) {
    logger.info('Using resources from base path ', config.EU4_PATH);

    var countries = {};
    var provinces = {};

    Promise.resolve()
        .then(function () {
            let tagPath = path.resolve(config.EU4_PATH, 'common/country_tags/00_countries.txt');
            logger.info('Generating countries from ', tagPath);
            return (new CountryFactory).all(tagPath);
        })
        .then(function (allCountries) {
            logger.info('Found ' + allCountries.length + ' countries.');
            _.forEach(allCountries, function (country) {
                countries[country.tag] = country;
            });
        })
        .then(function () {
            let definitionPath = path.resolve(config.EU4_PATH, 'map/definition.csv');
            logger.info('Reading definitions from ', definitionPath);
            return Definitions.fromFile(definitionPath);
        })
        .then(function (definitions) {
            _.forEach(definitions, function (definition) {
                provinces[_.get(definition, 'province')] = new Color(definition);
            });
            let mapPath = path.resolve(config.EU4_PATH, 'map/provinces.bmp');
            logger.info('Loading and resizing map ', mapPath);
            return new Map(1280).fromFile(mapPath);
        })
        .then(function (map) {
            logger.info('Building province mapping');
            return map.buildProvinceMapping(provinces);
        })
        .then(function (map) {
            let saveFilePath = process.argv[2];
            logger.info('Parsing save file ', saveFilePath);
            return FileReader.fromFile(saveFilePath)
                .then(function (save) {
                    logger.info('Building history');
                    var historyMapping = {};
                    _.forEach(save.root.provinces, function (province) {
                        let historySection = province.history;
                        if (historySection && historySection) {
                            let history = historySection;
                            _.forEach(historySection.$insertionOrder, function (key) {
                                if (HistoricalDate.isValid(key)) {
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
                    let timeline = _.keysIn(historyMapping);
                    timeline = timeline.sort(HistoricalDate.compare);
                    console.log(timeline);
                });
        })
        .catch(function (err) {
            logger.error(err);
        });
} else {
    console.log("Provide (unzipped) .eu4 file as first parameter");
}
