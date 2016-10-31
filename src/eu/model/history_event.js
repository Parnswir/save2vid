define(function() {

    // Possible war event:
    // - add_attacker
    // - add_defender
    // - rem_attacker
    // - rem_defender
    var HistoryEvent = function WarEvent(name, value) {
        this.name = name;
        this.value = value;
    }

    return HistoryEvent;
});
