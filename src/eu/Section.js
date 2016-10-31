var Section = function Section(name, parent) {
    this.name = name;
    this.parent = parent;
    this.elements = {};
    this.elements_order = [];
};

module.exports = Section;

Section.prototype.add_element = function(key, value) {
    if(key in this.elements) {
        // Element already known, use a list
        if(this.elements[key].constructor == Array) {
            this.elements[key].push(value);
        } else {
            this.elements[key] = [this.elements[key], value];
        }
    } else {
        // New element
        this.elements[key] = value;
        this.elements_order.push(key);
    }
};

Section.prototype.simple_keys = function() {
    var self = this;
    return this.elements_order.filter(function (elt) {
        return self.elements[elt].constructor !== Section
            || self.elements[elt].constructor !== Array;
    });
};
