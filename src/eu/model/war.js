define(function() {
    var War = function War(name, original_attacker, original_defender,
            attackers, defenders, history, casus_belli) {
        // War name
        this.name = name;

        // War original attacker / defender countries abbreviation
        this.original_attacker = original_attacker;
        this.original_defender = original_defender;

        // War attackers / defenders countries abbreviation
        this.attackers = attackers;
        this.defenders = defenders;

        // Optionnal war Casus Belli and CB type
        if(casus_belli) {
            this.casus_belli = {
                casus_belli: casus_belli["casus_belli"],
                type: casus_belli["type"],
                // Optionnal province target of the war
                province: casus_belli["province"] || "",
                // Optionnal war target
                // (SWE in sweden independance war for example)
                target: casus_belli["target"] || ""
            }
        } else {
            this.casus_belli = null;
        }

        // A list of history event with date = list of events
        this.history = history;
    };

    return War;
});
