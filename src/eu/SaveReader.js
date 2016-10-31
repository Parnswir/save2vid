var Save = require("./Save");
var Section = require("./Section");

module.exports = {
    from_local_file: from_local_file,
    from_string: from_string
};

// Extract a local EU save file
// Call handler with (err, save)
function from_local_file(filepath, handler) {
    var fs = require("fs");

    fs.readFile(filepath, function (err, data) {
        if(err) {
            handler(err);
        } else {
            handler(null, from_string(data.toString()));
        }
    });
}

// Extract an EU save string
function from_string(data) {
    var key = "[\\w\\.-]+"
      , value = '(?:' + '"[^"]*"' + '|' + key + ')';
    var regex = new RegExp("(?:"
        +value
        +"|"
        +"\\{"
        +"|"
        +"}"
        +"|"
        +"="
        +")"
    , "g"), res_g = data.match(regex), length = res_g.length;

    var stack = [], last_section_name = "", current_section = new Section()
      , debug=false, no_stack = false, depth_indent = "", save_type = "";

    function trim_value(s) {
        // Trim and delete first/last " characters
        return s.trim().replace(/^"|"$/g, "");
    }

    for(var i=0; i < length; i++) {
        var res = trim_value(res_g[i]);

        if(res == "{") {
            //console.log("{ found");
            var unnamed = false;

            if(stack.length < 2) {
                throw "{ found but stack.length = "+stack.length;
            }

            var last_elt  = stack.pop();
            if(last_elt == "=") {
                var token = stack.pop();
                if(token == '=' || token == '{' || token == '}') {
                    throw token + " found after = { when expected "+last_key;
                }

                last_section_name = token;
                current_section = new Section(last_section_name, current_section);
            } else {
                stack.push(last_elt);
                if(last_section_name == "") {
                    throw "Unnamed section found and no names available. Last token: "+last_elt;
                }
                unnamed = true;
                //console.log("Unnamed section found, take last section name as name: "+last_section_name);

                current_section = new Section(last_section_name, current_section);
            }

            if(debug) console.log(depth_indent+'<section name="'+last_section_name+
                '" unnamed="'+unnamed.toString()+'">');
            depth_indent += "    ";
        } else if(res == "}") {
            //console.log("} found");
            no_stack = true;

            var token, values = [];
            while((token = stack.pop()) != "{") {
                values.unshift(token);
            }
            // 'section_name' and '=' also removed in "{" part

            if(!values.length) {
                //console.log("End of section "+current_section.name);
                // Add current section in parent's elements
                current_section.parent.add_element(current_section.name, current_section);
            } else {
                if(current_section.elements_order.length) {
                    throw "Array found but elements also found: "+
                        Object.keys(current_section.elements)+". Array: "+
                        values.join(",");
                }
                if(debug) console.log(depth_indent+'<array value="\''+values.join("' '")+'\'" />')
                values = values.filter(function(elt) {
                    // Remove empty elements
                    return elt !== "";
                })

                // Current section is not a section but a list
                current_section.parent.add_element(current_section.name, values);
                // Clear list
                values = [];
            }

            depth_indent = depth_indent.slice(0, -4);
            if(debug) console.log(depth_indent+'</section>');
            current_section = current_section.parent;
        } else if(res == "=") {
            //console.log("= found");
        } else {
            //console.log("Value found: "+res);
            if(i == 0) {
                // Save type found
                save_type = res;
                if(debug) console.log("<"+save_type+">");
            }

            var token = stack.pop();
            if(token != "=") {
                stack.push(token);
                // Store an element or a key
            } else {
                // key = value found
                token = stack.pop();
                if(token == '=' || token == '{' || token == '}') {
                    throw token + " found after = value when expected a key";
                }

                var key = token
                  , value = res;

                if(debug) console.log(depth_indent+'<item name="'+key+'" value="'+value+'" />');
                current_section.add_element(key, value);
                no_stack = true;
            }
        }

        if(!no_stack) {
            stack.push(res);
        }
        no_stack = false;
    }

    if(save_type != "" && debug) {
        console.log("</"+save_type+">");
    }
    return new Save(save_type, current_section);
}
