'use strict';

module.exports= {
    isDate: isDate,
    parseDate: parseDate
};

var DATE = /^\d{3,4}(\.\d{1,2}){2}$/;

function isDate(string) {
    return DATE.test(string);
}

function parseDate(date) {
    if (date.constructor === Date) {
        return date;
    }
    if (!isDate(date)) {
        throw "Invalid date '" + date + "'";
    }

    let args = date.split(".");
    let year = parseInt(args[0], 10);
    let month = parseInt(args[1], 10);
    let day = parseInt(args[2], 10);
    return new Date(year, month, day);
}
