var Section = require('./Section');

var Save = function Save(save_type, root) {
    this.save_type = save_type;
    this.root = root || new Section();
};

module.exports = Save;

Save.prototype.to_json = function to_json(section) {
    function to_json_element(element) {
        if(element.constructor === Section) {
            // Recursive build
            return to_json(element);
        } else {
            return element;
        }
    }
    var o = {};
    if(!section) section = this.root;
    for(var i in section.elements_order) {
        var key = section.elements_order[i];

        if(section.elements[key].constructor === Array) {
            // For each items
            var items = [];
            for(var j in section.elements[key]) {
                var item = section.elements[key][j];
                items.push(to_json_element(item));
            }
            o[key] = items;
        } else {
            o[key] = to_json_element(section.elements[key]);
        }
    }
    return o;
};

Save.prototype.to_html = function to_html(section) {
    function is_section_array(array) {
        return array.every(function(elt){ elt.constructor == Section; });
    }
    function elt_to_html(key, value) {
        var s = '<li>';
        if (value.constructor == Array) {
            s += '<span class="eu-list-key">' + key + '</span>: <ul>';
            for (var i = 0, last_elt = null, cpt = 0; i < value.length; i++) {
                var elt = value[i];

                if(elt.constructor == Section) {
                    if(last_elt != null) {
                        s += '<li class="eu-array-elt">' + last_elt +
                            (cpt>1?' ('+cpt+' times)':'') +
                            '</li>';
                        cpt = 0;
                        last_elt = null;
                    }
                    s += elt_to_html(key, elt);
                } else {
                    if(last_elt == null) {
                        cpt = 0;
                        last_elt = elt;
                    }
                    else if(last_elt != elt) {
                        s += '<li class="eu-array-elt">' + last_elt +
                            (cpt>1?' ('+cpt+' times)':'') +'</li>';
                        cpt = 0;
                        last_elt = elt;
                    } else {
                        cpt += 1;
                    }
                }
            }
            if(last_elt != null) {
                // Issue when last element != Section
                s += '<li class="eu-array-elt">' + last_elt +
                    (cpt>1?' ('+cpt+' times)':'') +
                    '</li>';
            }
            s += '</ul>';
        } else if(value.constructor == Section) {
            s += '\n' + to_html(value);
        } else {
            s += '<span class="eu-section-key">' + key + '</span>: ' + value;
        }
        return s + '</li>\n';
    }

    var name = (section || {name: "Sauvegarde "+this.save_type}).name;
    var section = section || this.root;

    var s = '<p>' + name + ':</p> <ul>\n';
    if(!section.elements_order.length) {
        s += '<li><strong>/!\\</strong> Empty section</li>\n';
    }
    for(var i in section.elements_order) {
        var key = section.elements_order[i], value = section.elements[key];
        s += elt_to_html(key, value);
    }

    return s + '</ul>\n';
};
