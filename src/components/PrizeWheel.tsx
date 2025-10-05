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
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

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
    return (cardIndex * spacing) + halfCard;
  };

  useEffect(() => {
    if (!isSpinning) {
      const spacing = getCardSpacing();
      const speed = spacing / 1300;
      
      startTimeRef.current = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const currentOffset = elapsed * speed;
        
        setOffset(currentOffset);
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isSpinning, isMobile]);

  const getCardClass = (cardPosition: number) => {
    const spacing = getCardSpacing();
    const normalizedOffset = offset % (prizes.length * spacing);
    const normalizedPosition = cardPosition % (prizes.length * spacing);
    
    let distance = Math.abs(normalizedOffset - normalizedPosition);
    const loopDistance = (prizes.length * spacing) - distance;
    distance = Math.min(distance, loopDistance);
    
    if (distance < 10) return styles.center;
    if (distance < spacing + 10) return styles.near;
    if (distance < spacing * 2 + 10) return styles.far;
    return styles.hidden;
  };

  return (
    <div className={styles.wheelContainer} ref={containerRef}>
      <div className={styles.indicator}>▼</div>
      <div 
        className={`${styles.wheelTrack} ${isSpinning ? styles.spinning : ''}`}
        style={{
          transform: isMobile 
            ? `translateY(calc(-${offset}px))` 
            : `translateX(calc(-${offset}px))`
        }}
      >
        {Array(prizes.length * 3).fill(null).map((_, idx) => {
          const prize = prizes[idx % prizes.length];
          const spacing = getCardSpacing();
          const cardPosition = idx * spacing;
          const cardClass = getCardClass(cardPosition);
          
          const normalizedOffset = offset % (prizes.length * spacing);
          const normalizedPosition = cardPosition % (prizes.length * spacing);
          let distance = Math.abs(normalizedOffset - normalizedPosition);
          const loopDistance = (prizes.length * spacing) - distance;
          distance = Math.min(distance, loopDistance);
          const isCentered = distance < 10;
          
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