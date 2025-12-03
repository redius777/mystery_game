import { DecoButton } from "@/components/DecoButton";
import { DecoCard, DecoLayout } from "@/components/DecoLayout";
import { GameProvider, useGame, CharacterId } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";
import React from "react";

// --- Sub-components for each phase ---

function IntroPhase() {
  const { startGame } = useGame();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in duration-1000">
      <h1 className="text-6xl md:text-8xl font-display text-primary text-glow mb-4">
        豪華客船での<br/>密室殺人
      </h1>
      <p className="text-xl md:text-2xl font-body max-w-2xl text-muted-foreground leading-relaxed">
        優雅な船旅は悪夢へと変わった。<br/>
        一人の被害者。四人の容疑者。真実を見つけるための時間は50分。
      </p>
      <div className="pt-8">
        <DecoButton size="lg" onClick={startGame} className="text-xl px-12 py-6">
          ミステリーを始める
        </DecoButton>
      </div>
    </div>
  );
}

function CharacterSelectionPhase() {
  const { characters, selectCharacter } = useGame();
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      <h2 className="text-4xl font-display text-center text-primary mb-12">あなたの役割を選択</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(characters).map((char) => (
          <div key={char.id} 
               className="group relative cursor-pointer transition-transform hover:-translate-y-2"
               onClick={() => selectCharacter(char.id)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 rounded-lg"></div>
            <img src={char.image} alt={char.name} className="w-full h-[400px] object-cover rounded-lg border border-primary/20 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <h3 className="text-2xl font-display text-primary mb-1">{char.name}</h3>
              <p className="text-sm font-sans tracking-widest text-muted-foreground uppercase">{char.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GameHUD() {
  const { timer, currentPhase, selectedCharacter, characters } = useGame();
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const phaseName = currentPhase.replace(/_/g, " ").toUpperCase();

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <span className="font-display text-primary text-xl">クイーン・アルテミス号</span>
          <div className="h-6 w-px bg-primary/20"></div>
          <span className="font-sans text-xs tracking-widest text-muted-foreground">{phaseName}</span>
        </div>
        
        <div className="font-display text-3xl text-primary tabular-nums tracking-widest">
          {formatTime(timer)}
        </div>

        <div className="flex items-center gap-4">
          {selectedCharacter && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-sans text-muted-foreground hidden md:inline">あなたの役:</span>
              <span className="font-display text-primary">{characters[selectedCharacter].name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GameplayPhase() {
  const { currentPhase, advancePhase, characters, selectedCharacter, evidence, revealEvidence, castVote, votes } = useGame();
  
  if (!selectedCharacter) return null;
  const myChar = characters[selectedCharacter];

  return (
    <div className="pt-20 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Info */}
        <div className="lg:col-span-1 space-y-6">
          <DecoCard title="調査資料">
            <div className="space-y-4">
              <img src={myChar.image} alt={myChar.name} className="w-full h-48 object-cover rounded border border-primary/20 mb-4" />
              <div>
                <h4 className="font-sans text-xs uppercase text-muted-foreground mb-1">秘密</h4>
                <p className="font-body text-sm italic text-destructive/80 bg-destructive/10 p-3 rounded border border-destructive/20">
                  {myChar.secret}
                </p>
              </div>
              <div>
                <h4 className="font-sans text-xs uppercase text-muted-foreground mb-1">目的</h4>
                <p className="font-body text-sm text-primary/80">
                  {myChar.objective}
                </p>
              </div>
            </div>
          </DecoCard>
        </div>

        {/* Center Column: Main Action Area */}
        <div className="lg:col-span-2 space-y-6">
          <DecoCard className="min-h-[400px] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-display text-primary mb-6 border-b border-primary/20 pb-4">
                {currentPhase.replace(/_/g, " ")}
              </h2>
              
              <div className="prose prose-invert max-w-none">
                {currentPhase === "phase1_interrogation" && (
                  <p>他の乗客に自己紹介をしてください。事件発生時刻（23:30 - 00:00）のアリバイを主張しましょう。まだ自分の秘密を明かさないように注意してください。</p>
                )}
                {currentPhase === "evidence_reveal" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {evidence.map(e => (
                      <div key={e.id} 
                           className={cn("p-4 border rounded transition-all cursor-pointer", 
                             e.revealed ? "border-primary bg-primary/5" : "border-muted bg-muted/50 hover:border-primary/50")}
                           onClick={() => revealEvidence(e.id)}>
                        <h4 className="font-display text-lg mb-2">{e.revealed ? e.name : "???"}</h4>
                        <p className="text-sm text-muted-foreground">{e.revealed ? e.description : "クリックして証拠を調べる"}</p>
                      </div>
                    ))}
                  </div>
                )}
                {currentPhase === "free_discussion" && (
                  <p>証拠について議論してください。他のプレイヤーの話の矛盾点を追及しましょう。誰が犯人か推理を組み立ててください。</p>
                )}
                {currentPhase === "voting" && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(characters).map(char => (
                      <button key={char.id}
                              onClick={() => castVote(char.id)}
                              className="p-4 border border-primary/30 hover:bg-primary/10 text-left transition-colors rounded">
                        <span className="font-display text-lg block">{char.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">この容疑者を告発する</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <DecoButton onClick={advancePhase}>
                {currentPhase === "voting" ? "真実を明かす" : "次のフェーズへ"}
              </DecoButton>
            </div>
          </DecoCard>
        </div>
      </div>
    </div>
  );
}

function ConclusionPhase() {
  const { resetGame } = useGame();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in duration-500">
      <h2 className="text-5xl font-display text-primary mb-4">真実は明かされた</h2>
      <div className="max-w-2xl bg-card/50 p-8 border border-primary/30 rounded backdrop-blur-sm">
        <p className="text-lg font-body leading-relaxed mb-6">
          犯人は <strong>リリア・チェン</strong> でした。父の死への復讐心から、彼女はヴィクターの飲み物に毒を盛りました。<br/>
          しかし、ジェームス・ウィルソンはすでに遺言書を書き換えており、マーカス・グレイもまた独自の計画を立てていました。<br/>
          この船の上では、誰もが何らかの罪を背負っているのです。
        </p>
      </div>
      <DecoButton onClick={resetGame} variant="outline">もう一度プレイする</DecoButton>
    </div>
  );
}

function GameContent() {
  const { currentPhase } = useGame();

  return (
    <DecoLayout>
      {currentPhase !== "intro" && <GameHUD />}
      
      <div className="min-h-screen flex flex-col justify-center">
        {currentPhase === "intro" && <IntroPhase />}
        {currentPhase === "character_selection" && <CharacterSelectionPhase />}
        {(currentPhase !== "intro" && currentPhase !== "character_selection" && currentPhase !== "conclusion") && <GameplayPhase />}
        {currentPhase === "conclusion" && <ConclusionPhase />}
      </div>
    </DecoLayout>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
