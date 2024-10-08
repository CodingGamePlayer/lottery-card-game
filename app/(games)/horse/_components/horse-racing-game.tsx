"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Horse {
  id: number;
  name: string;
  position: number;
  speed: number;
  color: string;
  finishTime?: number;
}

export function HorseRacingGameComponent({
  horses,
  setHorses,
  onNewGame,
}: {
  horses: Horse[];
  setHorses: React.Dispatch<React.SetStateAction<Horse[]>>;
  onNewGame: () => void;
}) {
  const [isRacing, setIsRacing] = useState(false);
  const [finishedHorses, setFinishedHorses] = useState<Horse[]>([]);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  const minHorseWidth = 20;
  const maxHorseWidth = 40;
  const minLaneHeight = 30;
  const maxLaneHeight = 60;
  const nameOffset = 24;

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth - 32; // 32px for padding
      const newHeight = window.innerHeight * 0.8; // 80% of viewport height
      setTrackWidth(newWidth);
      setTrackHeight(newHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateHorseSize = () => {
    const availableHeight = trackHeight - nameOffset;
    const laneHeight = Math.max(minLaneHeight, Math.min(maxLaneHeight, availableHeight / horses.length));
    const horseWidth = Math.max(minHorseWidth, Math.min(maxHorseWidth, laneHeight * 0.8));
    return { laneHeight, horseWidth };
  };

  useEffect(() => {
    if (isRacing) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setHorses((prevHorses) => {
          const leadPosition = Math.max(...prevHorses.map((h) => h.position));

          const newHorses = prevHorses.map((horse) => {
            let newSpeed = horse.speed + (Math.random() - 0.5) * 1.5;

            const positionDifference = leadPosition - horse.position;
            if (positionDifference > trackWidth * 0.1) {
              const catchUpBoost = (positionDifference / trackWidth) * 1.5;
              newSpeed += catchUpBoost;
            }

            newSpeed = Math.max(0.5, Math.min(newSpeed, 5));

            return {
              ...horse,
              position: Math.min(horse.position + newSpeed, trackWidth),
              speed: newSpeed,
            };
          });

          const justFinished = newHorses.filter((horse) => horse.position >= trackWidth && !horse.finishTime);
          justFinished.forEach((horse) => {
            horse.finishTime = Date.now() - startTime;
          });

          if (justFinished.length > 0) {
            setFinishedHorses((prev) => [...prev, ...justFinished].sort((a, b) => a.finishTime! - b.finishTime!));
          }

          if (newHorses.every((horse) => horse.position >= trackWidth)) {
            setIsRacing(false);
            clearInterval(interval);
          }

          return newHorses;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isRacing, trackWidth]);

  const handleStartRace = () => {
    setIsRacing(true);
    setFinishedHorses([]);
  };

  const handleNewGame = () => {
    setIsRacing(false);
    onNewGame();
  };

  const renderGameControls = () => (
    <div className="flex flex-col items-center mb-4">
      <h1 className="text-2xl font-bold mb-4 text-center">경마 게임</h1>
      <Button onClick={isRacing ? handleNewGame : handleStartRace} disabled={isRacing}>
        {isRacing ? "새 게임" : "경주 시작"}
      </Button>
    </div>
  );

  const renderGameTrack = () => {
    const { laneHeight, horseWidth } = calculateHorseSize();
    return (
      <div className="w-full overflow-hidden" style={{ height: `${trackHeight}px` }}>
        <div
          className="border-t-4 border-b-4 border-gray-400 relative mx-auto"
          style={{
            height: `${trackHeight}px`,
            width: `${trackWidth}px`,
          }}
        >
          {horses.map((horse, index) => (
            <div
              key={horse.id}
              className="absolute transition-all duration-100 ease-linear"
              style={{
                left: `${(horse.position / trackWidth) * (trackWidth - horseWidth)}px`,
                top: `${index * laneHeight + nameOffset}px`,
                width: `${horseWidth}px`,
                height: `${horseWidth}px`,
              }}
            >
              <svg viewBox="0 0 100 100" width={horseWidth} height={horseWidth}>
                <path
                  d="M70 5 L80 15 L75 25 L60 25 Q65 15 70 5 M25 40 Q40 35 50 40 Q60 45 75 40 L75 70 L25 70 L25 40 M25 70 L25 90 L35 90 L35 70 M65 70 L65 90 L75 90 L75 70"
                  fill={horse.color}
                />
              </svg>
              <span className="absolute left-0 -top-6 text-sm font-bold whitespace-nowrap">{horse.name}</span>
            </div>
          ))}
          <div className="absolute top-0 bottom-0 border-l-2 border-red-500" style={{ right: "0" }}></div>
        </div>
      </div>
    );
  };

  const renderResults = () =>
    finishedHorses.length > 0 && (
      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold mb-2">결과</h3>
        {finishedHorses.map((horse, index) => (
          <p key={horse.id} className="text-lg">
            {index + 1}등: {horse.name} (#{horse.id}) - {(horse.finishTime! / 1000).toFixed(2)}초
          </p>
        ))}
      </div>
    );

  return (
    <>
      {renderGameControls()}
      <div className="flex flex-col items-start w-full">
        {renderGameTrack()}
        {renderResults()}
      </div>
    </>
  );
}
