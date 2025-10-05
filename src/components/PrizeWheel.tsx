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
const CARD_HEIGHT = 280;
const GAP = 24;
const CARD_WITH_GAP = CARD_WIDTH + GAP;
const CARD_WITH_GAP_VERTICAL = CARD_HEIGHT + 20;
const TOTAL_CARDS = 200;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCardSpacing = () => {
    if (isMobile) {
      return 216;
    }
    return CARD_WITH_GAP;
  };

  const calculateCenterOffset = (cardIndex: number) => {
    const spacing = getCardSpacing();
    if (isMobile) {
      const cardSize = 200;
      return (cardIndex * spacing) + (cardSize / 2);
    }
    return (cardIndex * spacing) + (CARD_WIDTH / 2);
  };

  useEffect(() => {
    if (!isSpinning) {
      let currentIndex = 3;
      setOffset(calculateCenterOffset(currentIndex));
      
      const animateToNext = () => {
        setOffset(calculateCenterOffset(currentIndex));
        
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
    <div className={styles.wheelContainer} ref={containerRef}>
      <div className={styles.indicator}>▼</div>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}
        style={{
          transform: isMobile 
            ? `translateY(calc(-${offset}px))` 
            : `translateX(calc(-${offset}px))`
        }}
      >
        {Array(TOTAL_CARDS).fill(null).map((_, idx) => {
          const prize = prizes[idx % prizes.length];
          const spacing = getCardSpacing();
          const cardPosition = idx * spacing;
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