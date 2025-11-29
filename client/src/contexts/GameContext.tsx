import React, { createContext, useContext, useState, useEffect } from "react";

// Game Phases
export type GamePhase = 
  | "intro" 
  | "character_selection" 
  | "phase1_interrogation" 
  | "evidence_reveal" 
  | "free_discussion" 
  | "phase2_interrogation" 
  | "voting" 
  | "conclusion";

// Character Types
export type CharacterId = "emilia" | "james" | "lilia" | "marcus";

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  age: number;
  description: string;
  secret: string;
  objective: string;
  image: string;
}

// Evidence Type
export interface Evidence {
  id: string;
  name: string;
  description: string;
  image?: string;
  revealed: boolean;
}

interface GameContextType {
  currentPhase: GamePhase;
  timer: number; // in seconds
  selectedCharacter: CharacterId | null;
  characters: Record<CharacterId, Character>;
  evidence: Evidence[];
  votes: Record<CharacterId, number>;
  
  // Actions
  startGame: () => void;
  selectCharacter: (id: CharacterId) => void;
  advancePhase: () => void;
  revealEvidence: (id: string) => void;
  castVote: (targetId: CharacterId) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_TIMER = {
  intro: 300, // 5 min
  character_selection: 0,
  phase1_interrogation: 600, // 10 min
  evidence_reveal: 480, // 8 min
  free_discussion: 900, // 15 min
  phase2_interrogation: 420, // 7 min
  voting: 300, // 5 min
  conclusion: 0
};

const CHARACTERS: Record<CharacterId, Character> = {
  emilia: {
    id: "emilia",
    name: "Emilia Rossi",
    role: "Art Appraiser",
    age: 35,
    description: "Sophisticated and calculating. Victor's former business partner who lost a fortune due to his betrayal.",
    secret: "Possesses documents proving Victor's fraud. Was planning to sue him.",
    objective: "Recover your reputation and financial loss. Hide your motive for revenge.",
    image: "/assets/character_emilia.png"
  },
  james: {
    id: "james",
    name: "James Wilson",
    role: "Lawyer",
    age: 42,
    description: "Intellectual and cautious. Victor's legal advisor who knows all his dirty secrets.",
    secret: "Beneficiary in Victor's will. Also took bribes from Victor's victims.",
    objective: "Secure the inheritance and avoid legal implication in Victor's crimes.",
    image: "/assets/character_james.png"
  },
  lilia: {
    id: "lilia",
    name: "Lilia Chen",
    role: "Secretary",
    age: 28,
    description: "Young and efficient. Victor's secretary who hides a deep resentment.",
    secret: "Daughter of a victim of Victor's fraud. Her father committed suicide.",
    objective: "Avenge her father's death. Collect evidence of Victor's crimes.",
    image: "/assets/character_lilia.png"
  },
  marcus: {
    id: "marcus",
    name: "Marcus Gray",
    role: "Captain",
    age: 55,
    description: "Authoritative and stern. The ship's captain with a strong sense of justice.",
    secret: "His best friend (Victor's son) was framed by Victor and is in jail.",
    objective: "Clear his friend's name. He needs money to help him.",
    image: "/assets/character_marcus.png"
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");
  const [timer, setTimer] = useState(INITIAL_TIMER.intro);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([
    { id: "poison_vial", name: "Empty Vial", description: "Found in the trash bin near the kitchen. Traces of cyanide.", revealed: false },
    { id: "will_copy", name: "Copy of Will", description: "A draft of a new will, disinheriting everyone.", revealed: false },
    { id: "threatening_letter", name: "Threatening Note", description: "Found in Victor's pocket. 'You will pay for what you did.'", revealed: false }
  ]);
  const [votes, setVotes] = useState<Record<CharacterId, number>>({
    emilia: 0, james: 0, lilia: 0, marcus: 0
  });

  // Timer Logic
  useEffect(() => {
    if (timer > 0 && currentPhase !== "character_selection" && currentPhase !== "conclusion") {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, currentPhase]);

  const startGame = () => {
    setCurrentPhase("character_selection");
  };

  const selectCharacter = (id: CharacterId) => {
    setSelectedCharacter(id);
    setCurrentPhase("phase1_interrogation");
    setTimer(INITIAL_TIMER.phase1_interrogation);
  };

  const advancePhase = () => {
    const phases: GamePhase[] = [
      "intro", "character_selection", "phase1_interrogation", 
      "evidence_reveal", "free_discussion", "phase2_interrogation", 
      "voting", "conclusion"
    ];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      setCurrentPhase(nextPhase);
      setTimer(INITIAL_TIMER[nextPhase as keyof typeof INITIAL_TIMER]);
    }
  };

  const revealEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, revealed: true } : e));
  };

  const castVote = (targetId: CharacterId) => {
    setVotes(prev => ({ ...prev, [targetId]: prev[targetId] + 1 }));
  };

  const resetGame = () => {
    setCurrentPhase("intro");
    setTimer(INITIAL_TIMER.intro);
    setSelectedCharacter(null);
    setVotes({ emilia: 0, james: 0, lilia: 0, marcus: 0 });
    setEvidence(prev => prev.map(e => ({ ...e, revealed: false })));
  };

  return (
    <GameContext.Provider value={{
      currentPhase,
      timer,
      selectedCharacter,
      characters: CHARACTERS,
      evidence,
      votes,
      startGame,
      selectCharacter,
      advancePhase,
      revealEvidence,
      castVote,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
