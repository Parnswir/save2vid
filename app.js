'use strict';

var _ = require('lodash');
var config = require('config');
var path = require('path');
var fs = require('fs');
var videoshow = require('videoshow');

var logger = require('./logger');
var FileReader = require("./eu/ParadoxFileReader");
var Definitions = require("./eu/Definitions");
var Map = require('./eu/Map');
var Color = require('./eu/Color');
var HistoricalDate = require('./eu/HistoricalDate');
var Country = require('./eu/Country').Country;
var CountryFactory = require('./eu/Country').CountryFactory;
var ProvinceFactory = require('./eu/ProvinceHistory').ProvinceFactory;

if(process.argv.length > 2) {
    logger.info('Using resources from base path ', config.EU4_PATH);

    var countries = {};
    var provinces = [];
    var provinceColors = {};

    Promise.resolve()
        .then(function () {
            let tagPath = path.resolve(config.EU4_PATH, config.map.countries);
            logger.info('Generating countries from ', tagPath);
            return (new CountryFactory).all(tagPath);
        })
        .then(function (allCountries) {
            logger.info('Found ' + allCountries.length + ' countries.');
            _.forEach(allCountries, function (country) {
                countries[country.tag] = country;
            });

            logger.info('Processing color overrides');
            countries[ProvinceFactory.PLACEHOLDER_SEA] = new Country(undefined, 'Water', config.map.colors.sea);
            countries[ProvinceFactory.PLACEHOLDER_WASTELAND] = new Country(undefined, 'Wasteland', config.map.colors.wasteland);
            let overrides = _.get(config, 'map.colors.overrides', {});
            _.forEach(_.keysIn(overrides), function (tag) {
                countries[tag] = new Country(tag, 'user-defined', overrides[tag]);
            });
            logger.info('Using ' + _.keysIn(overrides).length + ' overrides.');
        })
        .then(function () {
            let provincePath = path.resolve(config.EU4_PATH, config.map.history);
            logger.info('Reading provinces from ', provincePath);
            return new ProvinceFactory().all(provincePath);
        })
        .then(function (allProvinces) {
            logger.info('Found ' + allProvinces.length + ' provinces.');
            provinces = allProvinces;
        })
        .then(function () {
            let climatePath = path.resolve(config.EU4_PATH, config.map.climate);
            logger.info('Loading wastelands from', climatePath);
            return (new ProvinceFactory()).allWastelands(climatePath);
        })
        .then(function (wastelandProvinces) {
            logger.info('Found ' + wastelandProvinces.length + ' wastelands.');
            provinces = provinces.concat(wastelandProvinces);
        })
        .then(function () {
            let definitionPath = path.resolve(config.EU4_PATH, config.map.definition);
            logger.info('Reading definitions from ', definitionPath);
            return Definitions.fromFile(definitionPath);
        })
        .then(function (definitions) {
            _.forEach(definitions, function (definition) {
                provinceColors[_.get(definition, 'province')] = new Color(definition);
            });
            let mapPath = path.resolve(config.EU4_PATH, config.map.provinces);
            logger.info('Loading and resizing map ', mapPath);
            return new Map(config.map.width).fromFile(mapPath);
        })
        .then(function (map) {
            logger.info('Building province mapping');
            return map.buildProvinceMapping(provinceColors);
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
                    let frames = [];

                    logger.info('Generating initial map');
                    _.forEach(provinces, function (province) {
                        map.recolor([province.id], countries[province.owner].color);
                    });
                    let outPath = 'out/initial.png';
                    map.saveToFile(outPath);
                    frames.push(outPath);

                    logger.info('Generating frames');
                    _.forEach(timeline, function (date, index) {
                        let events = historyMapping[date];
                        _.forEach(events, function (event) {
                            map.recolor([event.id], countries[event.owner].color);
                        });
                        let framePath = 'out/frames/frame' + index + '.png';
                        map.saveToFile(framePath);
                        frames.push(framePath);
                    });

                    logger.info('Creating video. This might take a while.');
                    let promises = [];
                    let fpp = config.video.framesPerPart;
                    let parts = Math.ceil(frames.length / fpp);
                    for (var index = 1; index <= parts; index++) {
                        promises.push(function (index) {
                            return function (resolve, reject) {
                                logger.info('Creating part ' + index + '/' + parts);
                                var images = frames.slice((index - 1) * fpp, index * fpp);
                                var videoOptions = config.video.options(map.width);
                                videoshow(images, videoOptions)
                                    .save(config.video.outputPath(index) + '.' + videoOptions.format)
                                    .on('start', function (command) {
                                        logger.info('ffmpeg process started:', command);
                                    })
                                    .on('error', function (err, stdout, stderr) {
                                        logger.error('ffmpeg stderr:', stderr);
                                        reject(err);
                                    })
                                    .on('end', function (output) {
                                        logger.info('Video created in:', output);
                                        resolve();
                                    });
                            };
                        }(index));
                    }
                    if (config.video.parallelize) {
                        return Promise.all(promises.map(function (p) {
                            return new Promise(p);
                        }));
                    } else {
                        var promise = Promise.resolve();
                        promises.forEach(function (p) {
                            promise = promise.then(function() {return new Promise(p)});
                        });
                        return promise;
                    }
                });
        })
        .then(function () {
            logger.info('All done. Bye!')
        })
        .catch(function (err) {
            logger.error(err);
        });
} else {
    logger.error("Provide (unzipped) .eu4 file as first parameter");
}
