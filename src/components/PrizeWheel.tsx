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
    return isMobile ? MOBILE_CARD_WITH_GAP : CARD_WITH_GAP;
  };

  useEffect(() => {
    if (!isSpinning) {
      const spacing = getCardSpacing();
      
      const animateToNext = () => {
        setOffset(prev => prev + spacing);
        
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

  const getVisibleRange = () => {
    const spacing = getCardSpacing();
    const centerIndex = Math.floor(offset / spacing);
    const visibleCount = 10;
    return {
      start: centerIndex - visibleCount,
      end: centerIndex + visibleCount
    };
  };

  const getCardClass = (cardIndex: number) => {
    const spacing = getCardSpacing();
    const cardOffset = cardIndex * spacing;
    const distance = Math.abs(offset - cardOffset);
    
    if (distance < 10) return styles.center;
    if (distance < spacing + 10) return styles.near;
    if (distance < spacing * 2 + 10) return styles.far;
    return styles.hidden;
  };

  return (
    <div className={styles.wheelContainer} ref={containerRef}>
      <div className={styles.indicator}>▼</div>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : styles.idle}`}
        style={{
          transform: isMobile 
            ? `translateY(${offset}px)` 
            : `translateX(calc(-${offset}px))`
        }}
      >
        {(() => {
          const { start, end } = getVisibleRange();
          const cards = [];
          
          for (let i = start; i <= end; i++) {
            const prizeIndex = ((i % prizes.length) + prizes.length) % prizes.length;
            const prize = prizes[prizeIndex];
            const spacing = getCardSpacing();
            const cardOffset = i * spacing;
            const cardClass = getCardClass(i);
            const distance = Math.abs(offset - cardOffset);
            const isCentered = distance < 10;
            
            cards.push(
              <div
                key={`prize-${i}`}
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
          }
          
          return cards;
        })()}
      </div>
    </div>
  );
}
