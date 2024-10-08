import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">미니게임 선택</h1>
        <div className="space-y-4">
          <Link href="/card" className="block w-full">
            <Button className="w-full text-lg py-6">카드 추첨 게임</Button>
          </Link>
          <Link href="/horse" className="block w-full">
            <Button className="w-full text-lg py-6">말 경주 게임</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
