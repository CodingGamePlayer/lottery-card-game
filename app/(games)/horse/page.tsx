"use client";

import { useState } from "react";
import { HorseRacingGameComponent } from "@/app/(games)/horse/_components/horse-racing-game";
import { GameSetup } from "@/app/(games)/horse/_components/game-setup";

interface Horse {
  id: number;
  name: string;
  position: number;
  speed: number;
  color: string;
  finishTime?: number;
}

export default function HorsePage() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (setupHorses: { name: string; color: string }[]) => {
    const newHorses = setupHorses.map((horse, index) => ({
      id: index + 1,
      name: horse.name,
      position: 0,
      speed: Math.random() * 1.5 + 0.5,
      color: horse.color,
    }));
    setHorses(newHorses);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setGameStarted(false);
    setHorses([]);
  };

  return (
    <>
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <HorseRacingGameComponent horses={horses} setHorses={setHorses} onNewGame={handleNewGame} />
      )}
    </>
  );
}
