var Section = require('./Section');

var Save = function Save(fileType, root) {
    this.fileType = fileType;
    this.root = root || new Section();
};

module.exports = Save;
