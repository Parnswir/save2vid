var fs = require('fs');
var _ = require('lodash');

var logger = require('./../logger');
var File = require('./File');
var Section = require('./Section');

module.exports = {
    fromFile: fromFile,
    fromString: fromString
};

function fromFile(filepath) {
    return Promise.resolve()
        .then(function () {
            let data = fs.readFileSync(filepath, {encoding: 'latin1'});
            return fromString(data.toString());
        });
}

function fromString(data) {
    var regex = new RegExp("(?:(?:\"[^\"]*\"|#.+|[\\w\\.-]+)|\\{|}|=)", "g");
    var res_g = data.match(regex);

    var stack = [],
        lastSectionName = "",
        currentSection = new Section(),
        noStack = false,
        saveType = "";

    function trimValue(s) {
        return s.trim().replace(/^"|"$/g, '');
    }

    _.forEach(res_g, function (res, index) {
        res = trimValue(res);
        if (res.startsWith('#')) return;
        if (res == "{") {
            if (stack.length < 2) {
                logger.error("{ found but stack size = " + stack.length);
            }

            var last_elt = stack.pop();
            if (last_elt == "=") {
                let token = stack.pop();
                if (token in ['=', '{', '}']) {
                    logger.error(token + " found after = {");
                }

                lastSectionName = token;
                currentSection = new Section(lastSectionName, currentSection);
            } else {
                stack.push(last_elt);
                if (lastSectionName == "") {
                    logger.warn("Error while parsing file: Unnamed section. Last token: " + last_elt);
                }
                currentSection = new Section(lastSectionName, currentSection);
            }
        }
        else if (res == "}") {
            noStack = true;

            let token, values = [];
            while ((token = stack.pop()) != "{") {
                values.unshift(token);
            }

            if (!values.length) {
                currentSection.$parent.add_element(currentSection.$name, currentSection);
            } else {
                if (currentSection.$insertionOrder.length) {
                    logger.warn("Ignoring nested array: " + values.join(","));
                } else {
                    values = values.filter(function (elt) {
                        return elt !== "";
                    });

                    currentSection.$parent.add_element(currentSection.$name, values);
                }
            }
            currentSection = currentSection.$parent;
        }
        else if (res == "=") {
        }
        else {
            if (index == 0) {
                saveType = res;
            }

            let token = stack.pop();
            if (token != "=") {
                stack.push(token);
            } else {
                token = stack.pop();
                if (token in ['=', '{', '}']) {
                    logger.error(token + " found after = value when expected a key");
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

    return new File(saveType, currentSection);
}
