define(function() {

    function parse_country_state(state) {
        return {
            government: state["government"],
            mercantilism: state["mercantilism"],
            primary_culture: state["primary_culture"],
            religion: state["religion"],
            // accepted_culture: list expected
            accepted_culture: state["accepted_culture"],
            technology_group: state["technology_group"],
            capital: state["capital"],
            elector: state["elector"] || false
        };
    }

    var Country = function Country(country_abbr, current, original, history) {
        this.country_abbr = country_abbr;
        this.current = parse_country_state(current);
        this.original = parse_country_state(original);
        this.history = history;
    };

    return Country;
});