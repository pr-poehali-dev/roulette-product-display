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
const CARD_MARGIN_NEAR = 48;
const CARD_MARGIN_FAR = 8;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const extendedPrizes = [...prizes, ...prizes, ...prizes];

  useEffect(() => {
    setOffset(prizes.length * (CARD_WIDTH + CARD_MARGIN_NEAR * 2));
  }, [prizes.length]);

  useEffect(() => {
    if (!isSpinning) {
      const animateToNext = () => {
        setOffset((prev) => prev + CARD_WIDTH + CARD_MARGIN_NEAR * 2);
        
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
    const maxOffset = prizes.length * 2 * (CARD_WIDTH + CARD_MARGIN_NEAR * 2);
    if (offset >= maxOffset) {
      setTimeout(() => {
        setOffset(prizes.length * (CARD_WIDTH + CARD_MARGIN_NEAR * 2));
      }, 1000);
    }
  }, [offset, prizes.length]);

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
          return (
            <div
              key={`prize-${idx}`}
              className={styles.prizeCard}
              style={{ 
                backgroundColor: prize.color,
                margin: `0 ${CARD_MARGIN_NEAR}px`
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
