export type LoreCategory = 'bard' | 'zilean' | 'olaf' | 'generic';

export const lore: Record<LoreCategory, string[]> = {
    bard: [
        "Tuning the chimes of fate...",
        "Gathering cosmic dust for your tale...",
        "Listening to the whispers of the universe...",
        "Translating the star-song into words...",
    ],
    zilean: [
        "Reviewing the infinite timelines...",
        "Sifting through the sands of time...",
        "Observing a fixed point in your history...",
        "The past, present, and future converge...",
    ],
    olaf: [
        "Sharpening the axes of narrative...",
        "Recalling glorious slaughters...",
        "Singing a blood-song of your deeds...",
        "A saga worthy of a warrior is being forged...",
    ],
    generic: [
        "Consulting the Runeterran archives...",
        "Charging the Hextech narrative engine...",
        "Weaving the threads of your legend...",
        "Illustrating your legendary moments...",
    ],
};
