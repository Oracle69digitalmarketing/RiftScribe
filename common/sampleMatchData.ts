// This is a simplified sample of the League of Legends Match History data.
// It contains enough information to derive the insights we need.

export interface Participant {
    summonerName: string;
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    teamId: number;
}

export interface Match {
    metadata: {
        matchId: string;
    };
    info: {
        gameCreation: number;
        participants: Participant[];
    };
}

// A more extensive list of matches to better simulate a season slice.
export const matches: Match[] = [
  {
    "metadata": { "matchId": "NA1_10001" },
    "info": {
      "gameCreation": 1721240000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Garen", "kills": 10, "deaths": 2, "assists": 5, "win": true, "teamId": 100 },
        { "summonerName": "OpponentA", "championName": "Darius", "kills": 2, "deaths": 10, "assists": 3, "win": false, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10002" },
    "info": {
      "gameCreation": 1721243000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Garen", "kills": 12, "deaths": 1, "assists": 8, "win": true, "teamId": 100 },
        { "summonerName": "OpponentB", "championName": "Teemo", "kills": 1, "deaths": 12, "assists": 2, "win": false, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10003" },
    "info": {
      "gameCreation": 1721246000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Garen", "kills": 8, "deaths": 3, "assists": 10, "win": true, "teamId": 100 },
        { "summonerName": "OpponentA", "championName": "Darius", "kills": 3, "deaths": 8, "assists": 4, "win": false, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10004" },
    "info": {
      "gameCreation": 1721249000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Lux", "kills": 5, "deaths": 7, "assists": 15, "win": false, "teamId": 100 },
        { "summonerName": "OpponentC", "championName": "Zed", "kills": 15, "deaths": 5, "assists": 3, "win": true, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10005" },
    "info": {
      "gameCreation": 1721252000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Garen", "kills": 7, "deaths": 4, "assists": 6, "win": true, "teamId": 100 },
        { "summonerName": "OpponentD", "championName": "Fiora", "kills": 4, "deaths": 7, "assists": 2, "win": false, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10006" },
    "info": {
      "gameCreation": 1721255000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Ashe", "kills": 15, "deaths": 5, "assists": 12, "win": true, "teamId": 200 },
        { "summonerName": "OpponentE", "championName": "Caitlyn", "kills": 5, "deaths": 15, "assists": 6, "win": false, "teamId": 100 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10007" },
    "info": {
      "gameCreation": 1721258000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Lux", "kills": 10, "deaths": 4, "assists": 20, "win": true, "teamId": 200 },
        { "summonerName": "OpponentF", "championName": "Yasuo", "kills": 12, "deaths": 10, "assists": 5, "win": false, "teamId": 100 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10008" },
    "info": {
      "gameCreation": 1721261000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Garen", "kills": 2, "deaths": 8, "assists": 5, "win": false, "teamId": 100 },
        { "summonerName": "OpponentA", "championName": "Darius", "kills": 18, "deaths": 2, "assists": 3, "win": true, "teamId": 200 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10009" },
    "info": {
      "gameCreation": 1721264000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Ashe", "kills": 9, "deaths": 6, "assists": 14, "win": false, "teamId": 200 },
        { "summonerName": "OpponentG", "championName": "Draven", "kills": 16, "deaths": 9, "assists": 5, "win": true, "teamId": 100 }
      ]
    }
  },
  {
    "metadata": { "matchId": "NA1_10010" },
    "info": {
      "gameCreation": 1721267000000,
      "participants": [
        { "summonerName": "PlayerOne", "championName": "Teemo", "kills": 8, "deaths": 8, "assists": 8, "win": true, "teamId": 100 },
        { "summonerName": "OpponentH", "championName": "Gnar", "kills": 7, "deaths": 8, "assists": 5, "win": false, "teamId": 200 }
      ]
    }
  },
   {
    "metadata": { "matchId": "NA1_10011" },
    "info": { "gameCreation": 1721270000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Garen", "kills": 15, "deaths": 0, "assists": 5, "win": true, "teamId": 100 }, { "summonerName": "OpponentI", "championName": "Sett", "kills": 0, "deaths": 15, "assists": 2, "win": false, "teamId": 200 }] }
  },
  {
    "metadata": { "matchId": "NA1_10012" },
    "info": { "gameCreation": 1721273000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Lux", "kills": 3, "deaths": 5, "assists": 25, "win": true, "teamId": 200 }, { "summonerName": "OpponentJ", "championName": "Xerath", "kills": 8, "deaths": 6, "assists": 10, "win": false, "teamId": 100 }] }
  },
  {
    "metadata": { "matchId": "NA1_10013" },
    "info": { "gameCreation": 1721276000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Ashe", "kills": 11, "deaths": 3, "assists": 10, "win": true, "teamId": 100 }, { "summonerName": "OpponentK", "championName": "Jinx", "kills": 5, "deaths": 11, "assists": 5, "win": false, "teamId": 200 }] }
  },
  {
    "metadata": { "matchId": "NA1_10014" },
    "info": { "gameCreation": 1721279000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Garen", "kills": 6, "deaths": 6, "assists": 6, "win": false, "teamId": 200 }, { "summonerName": "OpponentA", "championName": "Darius", "kills": 12, "deaths": 6, "assists": 3, "win": true, "teamId": 100 }] }
  },
  {
    "metadata": { "matchId": "NA1_10015" },
    "info": { "gameCreation": 1721282000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Lux", "kills": 8, "deaths": 2, "assists": 18, "win": true, "teamId": 100 }, { "summonerName": "OpponentL", "championName": "Veigar", "kills": 4, "deaths": 8, "assists": 5, "win": false, "teamId": 200 }] }
  },
  {
    "metadata": { "matchId": "NA1_10016" },
    "info": { "gameCreation": 1721285000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Teemo", "kills": 10, "deaths": 5, "assists": 3, "win": true, "teamId": 200 }, { "summonerName": "OpponentB", "championName": "Teemo", "kills": 5, "deaths": 10, "assists": 2, "win": false, "teamId": 100 }] }
  },
  {
    "metadata": { "matchId": "NA1_10017" },
    "info": { "gameCreation": 1721288000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Ashe", "kills": 4, "deaths": 7, "assists": 11, "win": false, "teamId": 100 }, { "summonerName": "OpponentM", "championName": "Samira", "kills": 14, "deaths": 4, "assists": 8, "win": true, "teamId": 200 }] }
  },
  {
    "metadata": { "matchId": "NA1_10018" },
    "info": { "gameCreation": 1721291000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Garen", "kills": 9, "deaths": 4, "assists": 9, "win": true, "teamId": 200 }, { "summonerName": "OpponentN", "championName": "Jax", "kills": 6, "deaths": 9, "assists": 3, "win": false, "teamId": 100 }] }
  },
  {
    "metadata": { "matchId": "NA1_10019" },
    "info": { "gameCreation": 1721294000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Lux", "kills": 12, "deaths": 3, "assists": 22, "win": true, "teamId": 100 }, { "summonerName": "OpponentO", "championName": "Ahri", "kills": 7, "deaths": 12, "assists": 8, "win": false, "teamId": 200 }] }
  },
  {
    "metadata": { "matchId": "NA1_10020" },
    "info": { "gameCreation": 1721297000000, "participants": [{ "summonerName": "PlayerOne", "championName": "Ashe", "kills": 13, "deaths": 1, "assists": 8, "win": true, "teamId": 200 }, { "summonerName": "OpponentP", "championName": "Vayne", "kills": 2, "deaths": 13, "assists": 4, "win": false, "teamId": 100 }] }
  }
];
