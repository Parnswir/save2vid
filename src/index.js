var SaveReader = require("./eu/saveReader");

if(process.argv.length > 2) {
    SaveReader.fromFile(process.argv[2], function(err, save) {
        if(err) {
            console.log("Error: " + err);
        } else {
            console.log(save);
            //provinces: .root.elements.provinces.elements
        }
    });
} else {
    console.log("Provide (unzipped) .eu4 file as first parameter");
}
