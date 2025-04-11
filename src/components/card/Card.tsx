'use client';

import React from 'react';
import './card.css';  

type CardProps = {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ emoji, isFlipped, isMatched, onClick }) => {
  return (
    <div
      className={`card ${isFlipped || isMatched ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">❓</div>
        <div className="card-back">{emoji}</div>
      </div>
    </div>
  );
};

export default Card;
