import { useState, useEffect, useRef } from 'react';
import styles from './PrizeWheel.module.css';

interface Prize {
  id: number;
  text: string;
  type: string;
  color: string;
  emoji?: string;
  description: string;
}

interface PrizeWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinComplete: (prize: Prize) => void;
}

const CARD_WIDTH = 240;
const CARD_GAP = 24;
const CARD_WITH_GAP = CARD_WIDTH + CARD_GAP;
const MOBILE_CARD_SIZE = 200;
const MOBILE_GAP = 20;
const MOBILE_CARD_WITH_GAP = MOBILE_CARD_SIZE + MOBILE_GAP;
const VISIBLE_CARDS = 7;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCardSpacing = () => {
    return isMobile ? MOBILE_CARD_WITH_GAP : CARD_WITH_GAP;
  };

  useEffect(() => {
    if (!isSpinning) {
      const animateToNext = () => {
        setCurrentIndex(prev => prev + 1);
        
        animationRef.current = setTimeout(() => {
          animateToNext();
        }, 1300);
      };
      
      animationRef.current = setTimeout(() => {
        animateToNext();
      }, 1300);
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [isSpinning]);

  const renderCards = () => {
    const cards = [];
    const spacing = getCardSpacing();
    const centerOffset = Math.floor(VISIBLE_CARDS / 2);
    
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      const cardIndex = currentIndex - centerOffset + i;
      const prizeIndex = ((cardIndex % prizes.length) + prizes.length) % prizes.length;
      const prize = prizes[prizeIndex];
      const position = i - centerOffset;
      const distance = Math.abs(position);
      const isCentered = distance === 0;
      
      let cardClass = styles.prizeCard;
      if (distance === 0) cardClass += ` ${styles.center}`;
      else if (distance === 1) cardClass += ` ${styles.near}`;
      else if (distance === 2) cardClass += ` ${styles.far}`;
      else cardClass += ` ${styles.hidden}`;
      
      cards.push(
        <div
          key={i}
          className={cardClass}
          style={{ 
            backgroundColor: prize.color,
            transform: isMobile 
              ? `translateY(${position * spacing}px)` 
              : `translateX(${position * spacing}px)`
          }}
        >
          {prize.emoji && (
            <div className={`${styles.prizeEmoji} ${!isSpinning && isCentered ? styles.floating : ''}`}>
              {prize.emoji}
            </div>
          )}
          <div className={styles.prizeText}>
            {prize.text}
          </div>
          {prize.description && (
            <div className={styles.prizeDescription}>
              {prize.description}
            </div>
          )}
        </div>
      );
    }
    
    return cards;
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.indicator}>▼</div>
      <div className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}>
        {renderCards()}
      </div>
    </div>
  );
}