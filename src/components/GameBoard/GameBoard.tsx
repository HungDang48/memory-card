"use client";

import React, { useEffect, useState } from 'react';
import './gameBoard.css';
import Card from '../card/Card';
import confetti from 'canvas-confetti';

const emojiList = ['🍕','🎮','🚀','🎧','📚','🍩','🧃','🎲','🐱','🐶'];

const shuffleArray = (array: string[]) => {
  return [...array, ...array]
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({
      id: index,
      emoji: item,
      isFlipped: false,
      isMatched: false,
    }));
};

type CardType = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const GameBoard = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [time, setTime] = useState<number>(60); // Thời gian ban đầu là 60 giây
  const [isActive, setIsActive] = useState<boolean>(false);

  // Hàm sinh emoji theo level
  const generateLevelEmoji = (lvl: number) => {
    return emojiList.slice(0, lvl * 3);
  };

  // Reset game sau khi thay đổi cấp độ hoặc game kết thúc
  useEffect(() => {
    const newEmojis = generateLevelEmoji(level);
    setCards(shuffleArray(newEmojis));
    setFlippedIndices([]);
    setTime(60 + level * 5); // Tăng thêm 5 giây cho mỗi level
    setIsActive(true); // Bắt đầu lại thời gian
  }, [level]);

  // Hàm xử lý đếm ngược thời gian và kiểm tra khi hết giờ
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      alert("Hết giờ! Quay lại Level 1.");
      setLevel(1); // Reset level về 1
      setTime(60); // Đặt lại thời gian
      setCards([]); // Reset cards
      setFlippedIndices([]); // Reset flipped indices
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  // Hàm xử lý khi người chơi nhấp vào thẻ
  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flippedIndices, index];
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Kiểm tra khi hoàn thành level
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsActive(false);

      // 🎉 Gọi hiệu ứng confetti mạnh hơn và kéo dài thời gian
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 200,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          }
        });
      }, 250);

      setTimeout(() => {
        if (confirm(`Level ${level} complete with ${60 - time} seconds used! Next level?`)) {
          setLevel(level + 1);
        }
      }, duration + 500);
    }
  }, [cards]);

  return (
    <div className="game-container">
      {/* Video nền */}
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="/video/background1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div> {/* Lớp phủ */}
      </div>

      <div className="status-bar">
        <span>Level {level}</span>
        <span>Time left: {time}s</span>
      </div>
      <div className="card-grid">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
