define(function() {

    // Battle: A battle occurs during a war (obviously !!)
    var Battle = function Battle(name, date, location, victory, type, attacker, defender) {
        // name: usually location's name
        this.name = name;

        // date: when battle occurs
        this.date = date;

        // location: province ID
        this.location = location;

        // victory: true if attacker wins, false otherwise
        this.victory = victory;

        // Resolve battle type
        this.type = type;

        // inputs: Attacker and defender key => value attributes
        // battle type and units are extracted from these attributes.
        // Extracted attacker/defender contains :
        // - commander: string
        // - countries: country abbreviation
        // - attacker and defender: each country characteristics
        // And country characteristics contain:
        // - country: country abbreviation
        // - commander: main commander or empty string if no commander
        // - losses: army losses (integer)
        // - army: association between unit type and number
        this.attacker = attacker;
        this.defender = defender;
    };

    // Battle types associated with relatives units
    Battle.unit_types = {
        "land": [
            "infantry",
            "cavalry",
            "artillery"
        ],
        "sea": [
            "heavy_ship",
            "light_ship",
            "galley",
            "transport"
        ]
    }

    return Battle;
});
