var fs = require('fs');
var _ = require('lodash');

var Save = require('./Save');
var Section = require('./Section');

module.exports = {
    fromFile: fromFile,
    fromString: fromString
};

function fromFile(filepath, handler) {
    fs.readFile(filepath, function (err, data) {
        if (err) {
            handler(err);
        } else {
            handler(null, fromString(data.toString()));
        }
    });
}

function fromString(data) {
    var regex = new RegExp("(?:(?:\"[^\"]*\"|[\\w\\.-]+)|\\{|}|=)", "g");
    var res_g = data.match(regex);

    var stack = [],
        last_section_name = "",
        currentSection = new Section(),
        noStack = false,
        save_type = "";

    function trimValue(s) {
        return s.trim().replace(/^"|"$/g, "");
    }

    _.forEach(res_g, function (res, index) {
        res = trimValue(res);
        if (res == "{") {
            if (stack.length < 2) {
                throw "{ found but stack size = " + stack.length;
            }

            var last_elt = stack.pop();
            if (last_elt == "=") {
                let token = stack.pop();
                if (token in ['=', '{', '}']) {
                    throw token + " found after = {";
                }

                last_section_name = token;
                currentSection = new Section(last_section_name, currentSection);
            } else {
                stack.push(last_elt);
                if (last_section_name == "") {
                    throw "Unnamed section found and no names available. Last token: " + last_elt;
                }
                currentSection = new Section(last_section_name, currentSection);
            }
        }
        else if (res == "}") {
            noStack = true;

            let token, values = [];
            while ((token = stack.pop()) != "{") {
                values.unshift(token);
            }

            if (!values.length) {
                currentSection.parent.add_element(currentSection.name, currentSection);
            } else {
                if (currentSection.insertionOrder.length) {
                    throw "Array found but elements also found: " +
                    Object.keys(currentSection.elements) + ". Array: " +
                    values.join(",");
                }
                values = values.filter(function (elt) {
                    return elt !== "";
                });

                currentSection.parent.add_element(currentSection.name, values);
            }
            currentSection = currentSection.parent;
        }
        else if (res == "=") {
        }
        else {
            if (index == 0) {
                save_type = res;
            }

            let token = stack.pop();
            if (token != "=") {
                stack.push(token);
            } else {
                token = stack.pop();
                if (token in ['=', '{', '}']) {
                    throw token + " found after = value when expected a key";
                }

                currentSection.add_element(token, res);
                noStack = true;
            }
        }

        if (!noStack) {
            stack.push(res);
        }
        noStack = false;
    });

    return new Save(save_type, currentSection);
}
