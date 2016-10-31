define(["eu/model/battle", "eu/model/country", "eu/model/game", "eu/model/history_event",
            "eu/model/province", "eu/model/war", "eu/model/people"],
        function(Battle, Country, Game, HistoryEvent, Province, War, people) {
    return {
        Battle: Battle,
        Country: Country,
        Game: Game,
        HistoryEvent: HistoryEvent,
        Province: Province,
        War: War,
        MilitaryLeader: people.MilitaryLeader,
        Leader: people.Leader,
        Advisor: people.Advisor
    }
})