define(["underscore"], function(_) {

    var Province = function Province(id, current, original, history) {
        // Province id (Integer)
        this.id = id;

        // Default attributes are current province state
        this.current = this.parseProvince(current);
        
        // original contains original attributes
        this.original = this.parseProvince(original);

        // A list of history event associated with a date
        // An event can be:
        // - a model.HistoryEvent with name contained in Province.prototype.simple_events
        // - a model.HistoryEvent "building" constructed with value = building's name
        this.history = history;
    };

    Province.prototype.simple_events = [
        "controller", "owner"
    ];
    Province.prototype.useless_events = ["discovered_by", "add_claim","remove_claim",
        "add_core","remove_core","hre","culture","religion", "base_tax",
        "revolt_risk", "capital", "manpower", "name", "trade_goods",
        "citysize", "colonysize", "native_ferocity", "native_hostileness", "native_size"];

    // province state tools

    Province.prototype.state_attrs = [
        // Mandatories attributes
        "name", "religion", "capital", "culture",
        "trade_goods", "hre", "base_tax", "manpower",

        // Discovered province only
        "is_city", "owner", "controller",
        "trade",

        // Undiscovered province only
        "native_size", "native_ferocity", "native_hostileness"
    ];

    Province.prototype.state_attrs_list = [
        // Discovered province only
        "core"
    ];

    // Filter object with only state_attrs's keys
    Province.prototype.parseProvince = function parseProvinceState(
            characteristics, simple_callback, list_callback) {
        var attrs = _.pick(characteristics, Province.prototype.state_attrs);
        if(simple_callback) {
            attrs = _.object(_.map(attrs, function (elt, key) {
                return [key, simple_callback(elt)];
            }));
        }

        var l_attrs = _.pick(characteristics, Province.prototype.state_attrs_list);
        if(list_callback) {
            l_attrs = _.object(_.map(l_attrs, function (elt, key) {
                return [key, list_callback(elt)];
            }));
        }

        return _.extend(attrs, l_attrs);
    };

    return Province;
});


