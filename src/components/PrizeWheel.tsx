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

const CARD_WIDTH = 264;
const GAP = 24;
const CARD_WITH_GAP = CARD_WIDTH + GAP;
const TOTAL_CARDS = 200;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const [offset, setOffset] = useState(CARD_WITH_GAP * 3);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isSpinning) {
      let currentIndex = 3;
      
      const animateToNext = () => {
        setOffset(CARD_WITH_GAP * currentIndex);
        
        animationRef.current = setTimeout(() => {
          currentIndex++;
          if (currentIndex >= TOTAL_CARDS - 10) {
            currentIndex = 3;
          }
          animateToNext();
        }, 1300);
      };
      
      animateToNext();
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [isSpinning]);

  const getCardClass = (cardPosition: number) => {
    const distance = Math.abs(offset - cardPosition);
    
    if (distance < 10) return styles.center;
    if (distance < CARD_WITH_GAP + 10) return styles.near;
    if (distance < CARD_WITH_GAP * 2 + 10) return styles.far;
    return styles.hidden;
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.indicator}>▼</div>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}
        style={{
          transform: `translateX(-${offset}px)`
        }}
      >
        {Array(TOTAL_CARDS).fill(null).map((_, idx) => {
          const prize = prizes[idx % prizes.length];
          const cardPosition = idx * CARD_WITH_GAP;
          const cardClass = getCardClass(cardPosition);
          const isCentered = Math.abs(offset - cardPosition) < 10;
          
          return (
            <div
              key={`prize-${idx}`}
              className={`${styles.prizeCard} ${cardClass}`}
              style={{ backgroundColor: prize.color }}
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
        })}
      </div>
    </div>
  );
}