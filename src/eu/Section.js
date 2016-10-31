var Section = function Section(name, parent) {
    this.name = name;
    this.parent = parent;
    this.elements = {};
    this.insertionOrder = [];
};

module.exports = Section;

Section.prototype.add_element = function (key, value) {
    if (key in this.elements) {
        if(this.elements[key].constructor == Array) {
            this.elements[key].push(value);
        } else {
            this.elements[key] = [this.elements[key], value];
        }
    } else {
        this.elements[key] = value;
        this.insertionOrder.push(key);
    }
};
