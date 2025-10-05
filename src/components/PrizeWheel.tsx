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
const MOBILE_CARD_SIZE = 200;
const MOBILE_GAP = 20;
const MOBILE_CARD_WITH_GAP = MOBILE_CARD_SIZE + MOBILE_GAP;
const TOTAL_CARDS = 200;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const calculateCenterOffset = (cardIndex: number) => {
    const spacing = getCardSpacing();
    const halfCard = isMobile ? MOBILE_CARD_SIZE / 2 : CARD_WIDTH / 2;
    const loopIndex = cardIndex % prizes.length;
    return (loopIndex * spacing) + halfCard;
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
  }, [isSpinning, isMobile]);

  const getCardClass = (cardIndex: number) => {
    const spacing = getCardSpacing();
    const centerIndex = currentIndex % prizes.length;
    const cardLoopIndex = cardIndex % prizes.length;
    
    let distance = Math.abs(centerIndex - cardLoopIndex);
    const loopDistance = prizes.length - distance;
    distance = Math.min(distance, loopDistance);
    
    if (distance === 0) return styles.center;
    if (distance === 1) return styles.near;
    if (distance === 2) return styles.far;
    return styles.hidden;
  };

  return (
    <div className={styles.wheelContainer} ref={containerRef}>
      <div className={styles.indicator}>▼</div>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}
        style={{
          transform: isMobile 
            ? `translateY(calc(-${calculateCenterOffset(currentIndex)}px))` 
            : `translateX(calc(-${calculateCenterOffset(currentIndex)}px))`
        }}
      >
        {Array(prizes.length * 3).fill(null).map((_, idx) => {
          const prize = prizes[idx % prizes.length];
          const cardClass = getCardClass(idx);
          
          const centerIndex = currentIndex % prizes.length;
          const cardLoopIndex = idx % prizes.length;
          let distance = Math.abs(centerIndex - cardLoopIndex);
          const loopDistance = prizes.length - distance;
          distance = Math.min(distance, loopDistance);
          const isCentered = distance === 0;
          
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