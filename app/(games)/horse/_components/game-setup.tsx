import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameSetupProps {
  onStartGame: (horses: { name: string; color: string }[]) => void;
}

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F06292", "#AED581", "#7986CB", "#9575CD", "#4DB6AC"];

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [numHorses, setNumHorses] = useState(3);
  const [horseNames, setHorseNames] = useState<string[]>([]);
  const [gameStage, setGameStage] = useState<"setup" | "naming">("setup");

  const setupHorses = () => {
    setHorseNames(Array(numHorses).fill(""));
    setGameStage("naming");
  };

  const handleNameChange = (index: number, name: string) => {
    setHorseNames((prev) => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  const startGame = () => {
    const horses = horseNames.map((name, i) => ({
      name: name || `말 ${i + 1}`,
      color: colors[i % colors.length],
    }));
    onStartGame(horses);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">경마 게임 설정</h1>
      {gameStage === "setup" && (
        <Card className="mb-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>게임 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="numHorses" className="block mb-2">
                참여할 말의 수:
              </label>
              <Input
                id="numHorses"
                type="number"
                min="2"
                max="10"
                value={numHorses}
                onChange={(e) => setNumHorses(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <Button onClick={setupHorses} className="w-full">
              말 이름 입력하기
            </Button>
          </CardContent>
        </Card>
      )}
      {gameStage === "naming" && (
        <Card className="mb-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>말 이름 입력</CardTitle>
          </CardHeader>
          <CardContent>
            {horseNames.map((name, index) => (
              <Input
                key={index}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`말 ${index + 1}의 이름`}
                className="mb-2"
              />
            ))}
            <Button onClick={startGame} className="w-full mt-4">
              경주 시작
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
