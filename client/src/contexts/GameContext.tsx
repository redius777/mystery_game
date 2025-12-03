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
  intro: 300, // 5分
  character_selection: 0,
  phase1_interrogation: 600, // 10分
  evidence_reveal: 480, // 8分
  free_discussion: 900, // 15分
  phase2_interrogation: 420, // 7分
  voting: 300, // 5分
  conclusion: 0
};

const CHARACTERS: Record<CharacterId, Character> = {
  emilia: {
    id: "emilia",
    name: "エミリア・ロッシ",
    role: "美術品鑑定士",
    age: 35,
    description: "洗練された計算高い女性。ヴィクターの元ビジネスパートナーだが、彼の裏切りにより巨額の損失を被った。",
    secret: "ヴィクターの詐欺を証明する書類を持っている。彼を告訴する準備をしていた。",
    objective: "名声と財産を取り戻すこと。復讐の動機を隠し通すこと。",
    image: "/assets/character_emilia.png"
  },
  james: {
    id: "james",
    name: "ジェームス・ウィルソン",
    role: "弁護士",
    age: 42,
    description: "知的で慎重。ヴィクターの法務顧問であり、彼の汚い秘密をすべて知っている。",
    secret: "ヴィクターの遺言書の受取人である。また、ヴィクターの被害者たちから賄賂を受け取っていた。",
    objective: "遺産を確保し、ヴィクターの犯罪への法的関与を隠蔽すること。",
    image: "/assets/character_james.png"
  },
  lilia: {
    id: "lilia",
    name: "リリア・チェン",
    role: "秘書",
    age: 28,
    description: "若く有能な秘書。しかし、その内には深い恨みを隠している。",
    secret: "ヴィクターの詐欺被害者の娘。父親はヴィクターのせいで自殺した。",
    objective: "父の死の復讐を果たすこと。ヴィクターの犯罪の証拠を集めること。",
    image: "/assets/character_lilia.png"
  },
  marcus: {
    id: "marcus",
    name: "マーカス・グレイ",
    role: "船長",
    age: 55,
    description: "威厳があり厳格。強い正義感を持つこの船の船長。",
    secret: "親友（ヴィクターの息子）がヴィクターに罪を着せられ、投獄されている。",
    objective: "親友の汚名を晴らすこと。彼を救うための資金が必要。",
    image: "/assets/character_marcus.png"
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");
  const [timer, setTimer] = useState(INITIAL_TIMER.intro);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([
    { id: "poison_vial", name: "空の小瓶", description: "キッチンのゴミ箱で発見された。青酸カリの痕跡がある。", revealed: false },
    { id: "will_copy", name: "遺言書の写し", description: "新しい遺言書の下書き。全員への遺産相続を無効にする内容。", revealed: false },
    { id: "threatening_letter", name: "脅迫状", description: "ヴィクターのポケットから発見された。「お前のしたことの報いを受けさせる」と書かれている。", revealed: false }
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
