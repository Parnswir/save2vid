define(function() {

    var Game = function Game(start_date, date, player, players,
            religions, provinces, countries, wars) {
        this.start_date = start_date
        this.date = date
        this.player = player
        this.players = players
        this.religions = religions
        this.provinces = provinces
        this.countries = countries
        this.wars = wars
    };

    return Game;
});