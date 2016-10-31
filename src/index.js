var save_reader = require("./eu/saveReader");

if(process.argv.length > 2) {
    save_reader.from_local_file(process.argv[2], function(err, save) {
        if(err) {
            console.log("Error: " + err);
        } else {
            console.log(save.root.elements.provinces.elements);
        }
    });
} else {
    console.log("Provide .eu4 file in command line.");
}
