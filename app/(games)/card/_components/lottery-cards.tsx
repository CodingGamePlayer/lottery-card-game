"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../../../components/ui/input";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

interface Card {
  id: number;
  isWinner: boolean;
  isRevealed: boolean;
}

export function LotteryCards() {
  const [totalCards, setTotalCards] = useState(10);
  const [winningCards, setWinningCards] = useState(3);
  const [cards, setCards] = useState<Card[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [revealedWinners, setRevealedWinners] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isGameStarted) {
      generateCards();
    }
  }, [isGameStarted]);

  useEffect(() => {
    generateCards();
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  const generateCards = () => {
    const newCards: Card[] = Array.from({ length: totalCards }, (_, index) => ({
      id: index,
      isWinner: false,
      isRevealed: false, // 모든 카드를 처음에는 뒷면으로 설정
    }));

    let winnersAssigned = 0;
    while (winnersAssigned < winningCards) {
      const randomIndex = Math.floor(Math.random() * totalCards);
      if (!newCards[randomIndex].isWinner) {
        newCards[randomIndex].isWinner = true;
        winnersAssigned++;
      }
    }

    setCards(newCards);
    setGameOver(false);
    setRevealedWinners(0);
  };

  const handleCardClick = (id: number) => {
    setCards(
      cards.map((card) => {
        if (card.id === id && !card.isRevealed) {
          if (card.isWinner) {
            setRevealedWinners((prev) => prev + 1);
          }
          return { ...card, isRevealed: true };
        }
        return card;
      })
    );
  };

  useEffect(() => {
    if (revealedWinners === winningCards) {
      setGameOver(true);
    }
  }, [revealedWinners]);

  const handleStartGame = () => {
    if (totalCards >= winningCards) {
      setIsGameStarted(true);
    } else {
      alert("당첨 카드 수는 총 카드 수보다 작거나 같아야 합니다.");
    }
  };

  const handleReset = () => {
    setIsGameStarted(false);
    setCards([]);
    generateCards();
  };

  if (!isGameStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">카드 추첨 게임</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalCards">총 카드 수</Label>
              <Input id="totalCards" type="number" value={totalCards} onChange={(e) => setTotalCards(Number(e.target.value))} min={1} />
            </div>
            <div>
              <Label htmlFor="winningCards">당첨 카드 수</Label>
              <Input id="winningCards" type="number" value={winningCards} onChange={(e) => setWinningCards(Number(e.target.value))} min={1} />
            </div>
            <Button onClick={handleStartGame} className="w-full">
              게임 시작
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {gameOver && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">카드를 선택하세요</h1>
        {gameOver ? (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-green-600">축하합니다! 게임 종료!</h2>
            {/* <p>모든 당첨 카드를 찾았습니다.</p> */}
          </div>
        ) : (
          <p className="text-center mb-6">남은 당첨 카드: {winningCards - revealedWinners}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 [perspective:1000px] cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  card.isRevealed ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="absolute w-full h-full bg-black rounded-lg flex items-center justify-center text-white text-4xl font-bold [backface-visibility:hidden]">
                  ?
                </div>
                <div
                  className={`absolute w-full h-full rounded-lg flex items-center justify-center text-white text-xl font-bold [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    card.isWinner ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {card.isWinner ? "당첨!" : "통과"}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleReset} className="mt-6 w-full">
          다시 시작
        </Button>
      </div>
    </div>
  );
}
