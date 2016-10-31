define(function() {

    var isDate = /^\d{3,4}(\.\d{1,2}){2}$/;

    // Parse a string like "1572.9.22"
    function parseDate(date) {
        if(date.constructor === Date) {
            // Support call with already built date
            return date;
        }
        if(!isDate.test(date)) {
            throw "Invalid date '"+date+"'";
        }

        var args = date.split(".");
        var year = parseInt(args[0], 10),
            month = parseInt(args[1], 10),
            day = parseInt(args[2], 10);
        return new Date(year, month, day);
    }

    function contains(elt, array) {
        for(var size = array.length, i = 0;
            i < size; i++) {
            if(elt === array[i]) {
                return true;
            }
        }
        return false;
    }

    return {
        isDate: isDate,
        parseDate: parseDate,
        contains: contains
    }
});
