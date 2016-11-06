'use strict';

module.exports= {
    isValid: isDate,
    compare: compareDate
};

var DATE = /^\d{3,4}(\.\d{1,2}){2}$/;

function isDate(string) {
    return DATE.test(string);
}

function compareDate(a, b) {
    a = parse(a);
    b = parse(b);
    let delta = a.year - b.year;
    if (delta === 0) delta = a.month - b.month;
    if (delta === 0) delta = a.day - b.day;
    return delta;
}

function parse(string) {
    if (!isDate(string)) {
        throw "Invalid date '" + string + "'";
    }
    let date = string.split('.').map(parseInt);
    return {year: date[0], month: date[1], day: date[2]};
}
