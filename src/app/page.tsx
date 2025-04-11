import Image from "next/image";
import styles from "./page.module.css";
import GameBoard from "@/components/GameBoard/GameBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      
      <GameBoard />
    </main>
  );
}
