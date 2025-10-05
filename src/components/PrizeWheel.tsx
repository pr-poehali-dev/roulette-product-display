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
const VISIBLE_CARDS = 5;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();
  const [renderOffset, setRenderOffset] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCardSpacing = () => {
    return isMobile ? MOBILE_CARD_WITH_GAP : CARD_WITH_GAP;
  };

  const calculateCenterOffset = () => {
    const spacing = getCardSpacing();
    const halfCard = isMobile ? MOBILE_CARD_SIZE / 2 : CARD_WIDTH / 2;
    return (Math.floor(VISIBLE_CARDS / 2) * spacing) + halfCard;
  };

  useEffect(() => {
    if (!isSpinning) {
      const animateToNext = () => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= prizes.length) {
            setRenderOffset(offset => offset + prizes.length);
            return 0;
          }
          return next;
        });
        
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
  }, [isSpinning, isMobile, prizes.length]);

  const getVisibleCards = () => {
    const cards = [];
    const startIdx = currentIndex - Math.floor(VISIBLE_CARDS / 2);
    
    for (let i = 0; i < VISIBLE_CARDS + 2; i++) {
      const idx = startIdx + i;
      const prizeIdx = ((idx % prizes.length) + prizes.length) % prizes.length;
      cards.push({
        prize: prizes[prizeIdx],
        position: i,
        absoluteIndex: idx
      });
    }
    
    return cards;
  };

  const getCardClass = (position: number) => {
    const centerPos = Math.floor(VISIBLE_CARDS / 2);
    const distance = Math.abs(position - centerPos);
    
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
            ? `translateY(calc(-${calculateCenterOffset()}px))` 
            : `translateX(calc(-${calculateCenterOffset()}px))`
        }}
      >
        {getVisibleCards().map(({ prize, position, absoluteIndex }) => {
          const cardClass = getCardClass(position);
          const centerPos = Math.floor(VISIBLE_CARDS / 2);
          const isCentered = position === centerPos;
          
          return (
            <div
              key={`prize-${absoluteIndex}`}
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