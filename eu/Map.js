'use strict';

var jimp = require('jimp');
var _ = require('lodash');

var Color = require('./Color');

var Map = function (width) {
    this.width = width;
    this.colorMapping = {};
    this.provinceMapping = {};
};

module.exports = Map;

Map.prototype.fromFile = function (path) {
    var self = this;
    return jimp.read(path)
        .then(function (image) {
            image.resize(self.width, jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR);
            self.image = image;
        })
        .then(function () {
            self.colorMapping = {};
            self.image.scan(0, 0, self.image.bitmap.width, self.image.bitmap.height, function (x, y, idx) {
                let color = new Color(this.bitmap.data.slice(idx, idx + 3));
                let value = _.get(self.colorMapping, color.toString(), []);
                value.push(idx);
                self.colorMapping[color.toString()] = value;
            });
            return Promise.resolve(self);
        });
};

Map.prototype.saveToFile = function (path) {
    if (this.image) {
        return this.image.write(path);
    } else {
        return Promise.reject('Map has to be loaded first');
    }
};

Map.prototype.recolor = function (provinces, newColor) {
    var self = this;
    if (this.image) {
        _.forEach(provinces, function (province) {
            _.forEach(_.get(self.provinceMapping, province, []), function (idx) {
                self.image.bitmap.data[idx + 0] = newColor.red;
                self.image.bitmap.data[idx + 1] = newColor.green;
                self.image.bitmap.data[idx + 2] = newColor.blue;
            })
        });
        return Promise.resolve(this);
    } else {
        return Promise.reject('Map has to be loaded first');
    }
};

Map.prototype.buildProvinceMapping = function (mapping) {
    var self = this;
    return Promise.resolve()
        .then(function () {
            _.forEach(_.keys(mapping), function (key) {
                self.provinceMapping[key] = self.colorMapping[mapping[key].toString()];
            });
            return self;
        });
};
