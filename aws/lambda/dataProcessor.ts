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

export interface ChampionWinRate {
    name: string;
    wins: number;
    games: number;
    winRate: string;
}

import { PlayerInsights } from '../../common/dataProcessor';

export function analyzeMatches(matches: Match[], summonerName: string): PlayerInsights {
    if (!matches || matches.length === 0) {
        return {
            mostPlayedChampions: [],
            totalGames: 0,
            wins: 0,
            losses: 0,
            winRate: '0%',
            longestWinningStreak: 0,
            bestKDA: { champion: 'Unknown', kda: '0.00' },
            archNemesis: { name: 'None', losses: 0 },
        };
    }

    let wins = 0;
    let longestWinningStreak = 0;
    let currentWinningStreak = 0;
    const championStats: { [key: string]: { games: number; wins: number; } } = {};
    const nemesisTracker: { [key: string]: number } = {};
    let bestKDAValue = -1;
    let bestKDA = { champion: 'Unknown', kda: '0.00' };

    for (const match of matches) {
        const player = match.info.participants.find(p => p.summonerName.toLowerCase() === summonerName.toLowerCase());
        if (!player) continue;

        if (player.win) {
            wins++;
            currentWinningStreak++;
        } else {
            longestWinningStreak = Math.max(longestWinningStreak, currentWinningStreak);
            currentWinningStreak = 0;

            const opponents = match.info.participants.filter(p => p.teamId !== player.teamId);
            opponents.forEach(opp => {
                nemesisTracker[opp.championName] = (nemesisTracker[opp.championName] || 0) + 1;
            });
        }

        if (!championStats[player.championName]) {
            championStats[player.championName] = { games: 0, wins: 0 };
        }
        championStats[player.championName].games++;
        if (player.win) {
            championStats[player.championName].wins++;
        }

        const kda = player.deaths === 0 ? (player.kills + player.assists) : (player.kills + player.assists) / player.deaths;
        if (kda > bestKDAValue) {
            bestKDAValue = kda;
            bestKDA = { champion: player.championName, kda: kda.toFixed(2) };
        }
    }

    longestWinningStreak = Math.max(longestWinningStreak, currentWinningStreak);

    const mostPlayedChampions = Object.entries(championStats)
        .sort((a, b) => b[1].games - a[1].games)
        .slice(0, 3)
        .map(([name, stats]) => ({
            name,
            ...stats,
            winRate: `${((stats.wins / stats.games) * 100).toFixed(0)}%`,
        }));

    const archNemesisEntry = Object.entries(nemesisTracker).sort((a, b) => b[1] - a[1])[0];
    const archNemesis = archNemesisEntry
        ? { name: archNemesisEntry[0], losses: archNemesisEntry[1] }
        : { name: 'Their own ambition', losses: 0 };

    const totalGames = matches.length;
    return {
        totalGames,
        wins,
        losses: totalGames - wins,
        winRate: `${((wins / totalGames) * 100).toFixed(0)}%`,
        longestWinningStreak,
        mostPlayedChampions,
        bestKDA,
        archNemesis,
    };
}
