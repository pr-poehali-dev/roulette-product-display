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

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSpinning) {
      const animateToNext = () => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          return next >= prizes.length ? 0 : next;
        });
        
        animationRef.current = setTimeout(animateToNext, 2500);
      };
      
      animationRef.current = setTimeout(animateToNext, 2500);
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [isSpinning, prizes.length]);

  const getVisiblePrizes = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      let index = currentIndex + i;
      if (index < 0) index = prizes.length + index;
      if (index >= prizes.length) index = index - prizes.length;
      visible.push({ prize: prizes[index], offset: i });
    }
    return visible;
  };

  const getCardClass = (offset: number) => {
    if (offset === 0) return styles.center;
    if (Math.abs(offset) === 1) return styles.near;
    if (Math.abs(offset) === 2) return styles.far;
    return styles.hidden;
  };

  const visiblePrizes = getVisiblePrizes();

  const getMarginClass = (offset: number) => {
    if (Math.abs(offset) === 1) return styles.nearMargin;
    if (Math.abs(offset) === 2) return styles.farMargin;
    return '';
  };

  return (
    <div ref={containerRef} className={styles.wheelContainer}>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}
      >
        {visiblePrizes.map(({ prize, offset }) => {
          const cardClass = getCardClass(offset);
          const marginClass = getMarginClass(offset);
          const isCentered = offset === 0;
          
          return (
            <div
              key={`${offset}`}
              className={`${styles.prizeCard} ${cardClass} ${marginClass}`}
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