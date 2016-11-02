'use strict';

var jimp = require('jimp');
var _ = require('lodash');

var Map = function (width) {
    this.width = width;
};

module.exports = Map;

Map.prototype.fromFile = function (path) {
    var self = this;
    return jimp.read(path)
        .then(function(image) {
            image.resize(self.width, jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR);
            self.image = image;
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

Map.prototype.replace = function (originalColor, newColor) {
    if (this.image) {
        this.image.scan(0, 0, this.image.bitmap.width, this.image.bitmap.height, function (x, y, idx) {
            var currentColor = {
                red:   this.bitmap.data[idx + 0],
                green: this.bitmap.data[idx + 1],
                blue:  this.bitmap.data[idx + 2]
            };

            if (_.isEqual(currentColor, _.pick(originalColor, ['red', 'green', 'blue']))) {
                this.bitmap.data[idx + 0] = newColor.red;
                this.bitmap.data[idx + 1] = newColor.green;
                this.bitmap.data[idx + 2] = newColor.blue;
            }
        });
        return Promise.resolve(this);
    } else {
        return Promise.reject('Map has to be loaded first');
    }
};
