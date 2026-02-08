// Psychological Tarot Logic (Mock)
// Uses Jungian archetypes and reflective questioning instead of prediction.

export interface TarotCard {
  name: string;
  meaning: string; // Traditional keywords
  archetype: string; // Jungian archetype
  reflection: string; // Psychological prompt
}

export const MOCK_DECK: TarotCard[] = [
  { 
    name: "The Fool", 
    meaning: "New beginnings, optimism, trust", 
    archetype: "The Divine Child",
    reflection: "Where in your life are you being called to step into the unknown without fear?" 
  },
  { 
    name: "The Magician", 
    meaning: "Action, power, manifestation", 
    archetype: "The Alchemist",
    reflection: "What tools or skills do you already possess that you are underutilizing?" 
  },
  { 
    name: "The High Priestess", 
    meaning: "Intuition, mystery, subconscious", 
    archetype: "The Wise Woman / Anima",
    reflection: "What is your intuition whispering that your logical mind is trying to ignore?" 
  },
  { 
    name: "The Empress", 
    meaning: "Abundance, nature, nurturing", 
    archetype: "The Great Mother",
    reflection: "How can you better nurture your own creative projects or physical well-being right now?" 
  },
  { 
    name: "The Emperor", 
    meaning: "Structure, authority, discipline", 
    archetype: "The Father",
    reflection: "Where do you need to establish firmer boundaries or create more structure?" 
  },
  { 
    name: "The Hermit", 
    meaning: "Introspection, solitude, guidance", 
    archetype: "The Sage",
    reflection: "Is your current withdrawal an escape, or a necessary period of integration?" 
  },
    { 
    name: "The Tower", 
    meaning: "Sudden change, upheaval, revelation", 
    archetype: "The Destroyer",
    reflection: "What structures in your life must crumble to make way for your true self?" 
  },
  { 
    name: "The Star", 
    meaning: "Hope, faith, renewal", 
    archetype: "The Healer",
    reflection: "After the storm, what is the single guiding light you can focus on?" 
  },
];

export const getRandomCard = (): TarotCard => {
  return MOCK_DECK[Math.floor(Math.random() * MOCK_DECK.length)];
};
