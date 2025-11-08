export interface ChampionWinRate {
    name: string;
    wins: number;
    games: number;
    winRate: string;
}

export interface PlayerInsights {
    mostPlayedChampions: ChampionWinRate[];
    totalGames: number;
    wins: number;
    losses: number;
    winRate: string;
    longestWinningStreak: number;
    bestKDA: { champion: string; kda: string; };
    archNemesis: { name: string; losses: number; };
}
