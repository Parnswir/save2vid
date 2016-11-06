var Section = function Section(name, parent) {
    this.$name = name;
    this.$parent = parent;
    this.$insertionOrder = [];
};

module.exports = Section;

Section.prototype.add_element = function (key, value) {
    if (key in this) {
        if(this[key].constructor == Array) {
            this[key].push(value);
        } else {
            this[key] = [this[key], value];
        }
    } else {
        this[key] = value;
        this.$insertionOrder.push(key);
    }
};
