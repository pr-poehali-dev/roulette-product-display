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

const CARD_WIDTH = 220;
const CARD_MARGIN = 48;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const extendedPrizes = [...prizes, ...prizes, ...prizes];

  useEffect(() => {
    setOffset(prizes.length * (CARD_WIDTH + CARD_MARGIN * 2));
  }, [prizes.length]);

  useEffect(() => {
    if (!isSpinning) {
      const animateToNext = () => {
        setOffset((prev) => prev + CARD_WIDTH + CARD_MARGIN * 2);
        
        animationRef.current = setTimeout(animateToNext, 2500);
      };
      
      animationRef.current = setTimeout(animateToNext, 2500);
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [isSpinning]);

  useEffect(() => {
    const maxOffset = prizes.length * 2 * (CARD_WIDTH + CARD_MARGIN * 2);
    if (offset >= maxOffset) {
      setTimeout(() => {
        setOffset(prizes.length * (CARD_WIDTH + CARD_MARGIN * 2));
      }, 1000);
    }
  }, [offset, prizes.length]);

  const getCardDistance = (idx: number) => {
    const centerIndex = Math.round(offset / (CARD_WIDTH + CARD_MARGIN * 2));
    return Math.abs(idx - centerIndex);
  };

  const getCardClass = (distance: number) => {
    if (distance === 0) return styles.center;
    if (distance === 1) return styles.near;
    if (distance === 2) return styles.far;
    return styles.hidden;
  };

  return (
    <div ref={containerRef} className={styles.wheelContainer}>
      <div 
        className={styles.wheelTrack}
        style={{
          transform: `translateX(calc(50% - ${offset}px))`,
          transition: 'transform 1s ease-in-out'
        }}
      >
        {extendedPrizes.map((prize, idx) => {
          const distance = getCardDistance(idx);
          const cardClass = getCardClass(distance);
          
          return (
            <div
              key={`prize-${idx}`}
              className={`${styles.prizeCard} ${cardClass}`}
              style={{ 
                backgroundColor: prize.color,
                margin: `0 ${CARD_MARGIN}px`
              }}
            >
              {prize.emoji && (
                <div className={styles.prizeEmoji}>
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
