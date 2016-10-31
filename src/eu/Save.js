var Section = require('./Section');

var Save = function Save(saveType, root) {
    this.saveType = saveType;
    this.root = root || new Section();
};

module.exports = Save;
