import { useState, useEffect, useRef } from 'react';
import styles from './PrizeWheel.module.css';
import DiscountSticker from './DiscountSticker';

interface Prize {
  id: number;
  text: string;
  type: string;
  color: string;
  emoji?: string;
  image?: string;
  description: string;
  discount?: {
    type: 'percent' | 'price';
    value: string;
  };
}

interface PrizeWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinComplete: (prize: Prize) => void;
  targetPrizeId?: number;
}

const CARD_WIDTH = 240;
const CARD_GAP = 24;
const CARD_WITH_GAP = CARD_WIDTH + CARD_GAP;
const MOBILE_CARD_SIZE = 200;
const MOBILE_GAP = 20;
const MOBILE_CARD_WITH_GAP = MOBILE_CARD_SIZE + MOBILE_GAP;
const VISIBLE_CARDS = 7;

export default function PrizeWheel({ prizes, isSpinning, onSpinComplete, targetPrizeId }: PrizeWheelProps) {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const animationRef = useRef<number>();
  const trackRef = useRef<HTMLDivElement>(null);

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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (isSpinning) {
      setShowWinner(false);
      
      const targetIndex = prizes.findIndex(p => p.id === targetPrizeId);
      const finalPrizeIndex = targetIndex >= 0 ? targetIndex : 0;
      
      const spacing = isMobile ? MOBILE_CARD_WITH_GAP : CARD_WITH_GAP;
      const totalRotations = prizes.length * 4 + finalPrizeIndex;
      const totalDistance = totalRotations * spacing;
      const duration = 5000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        const currentOffset = easeOut * totalDistance;
        setOffset(currentOffset);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            setShowWinner(true);
            onSpinComplete(prizes[finalPrizeIndex]);
          }, 300);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (!showWinner) {
      const spacing = isMobile ? MOBILE_CARD_WITH_GAP : CARD_WITH_GAP;
      const startTime = Date.now();
      const idleSpeed = spacing / 2000;
      
      const idleAnimation = () => {
        const elapsed = Date.now() - startTime;
        const newOffset = elapsed * idleSpeed;
        setOffset(newOffset);
        animationRef.current = requestAnimationFrame(idleAnimation);
      };
      
      animationRef.current = requestAnimationFrame(idleAnimation);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, showWinner, prizes, targetPrizeId, onSpinComplete, isMobile]);

  const renderCards = () => {
    const cards = [];
    const spacing = getCardSpacing();
    const currentIndexFloat = -offset / spacing;
    const centerCard = Math.floor(VISIBLE_CARDS / 2);
    const startIndex = Math.floor(currentIndexFloat) - centerCard;
    
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      const arrayIndex = startIndex + i;
      const prizeIndex = ((arrayIndex % prizes.length) + prizes.length) % prizes.length;
      const prize = prizes[prizeIndex];
      const position = i - centerCard;
      const distance = Math.abs(position);
      const isCentered = distance === 0;
      
      let cardClass = styles.prizeCard;
      if (showWinner && !isCentered) {
        cardClass += ` ${styles.hidden}`;
      } else if (showWinner && isCentered) {
        cardClass += ` ${styles.winner}`;
      } else if (distance === 0) {
        cardClass += ` ${styles.center}`;
      } else if (distance === 1) {
        cardClass += ` ${styles.near}`;
      } else if (distance === 2) {
        cardClass += ` ${styles.far}`;
      } else {
        cardClass += ` ${styles.hidden}`;
      }
      
      cards.push(
        <div
          key={`${arrayIndex}-${prizeIndex}`}
          className={cardClass}
          style={{
            transform: isMobile
              ? `translate(-50%, calc(-50% + ${-position * spacing}px))`
              : `translate(calc(-50% + ${-position * spacing}px), -50%)`
          }}
        >
          {isCentered && (
            <div className={styles.prizeTitle}>
              {prize.text}
            </div>
          )}
          {prize.discount && (
            <DiscountSticker 
              type={prize.discount.type} 
              value={prize.discount.value}
              color={prize.color as any}
            />
          )}
          {prize.image && (
            <img 
              src={prize.image} 
              alt={prize.text}
              className={styles.prizeImage}
            />
          )}
        </div>
      );
    }
    
    return cards;
  };

  const spacing = getCardSpacing();
  const currentIndexFloat = offset / spacing;
  const translateOffset = -(currentIndexFloat - Math.floor(currentIndexFloat)) * spacing;

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.indicator}>▼</div>
      <div 
        ref={trackRef}
        className={styles.wheelTrack}
        style={{
          transform: isMobile 
            ? `translateY(${translateOffset}px)` 
            : `translateX(${translateOffset}px)`
        }}
      >
        {renderCards()}
      </div>
    </div>
  );
}