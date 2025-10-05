import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const getScale = (offset: number) => {
    if (offset === 0) return 1.2;
    if (Math.abs(offset) === 1) return 0.9;
    if (Math.abs(offset) === 2) return 0.75;
    return 0.6;
  };

  const getOpacity = (offset: number) => {
    if (offset === 0) return 1;
    if (Math.abs(offset) === 1) return 0.8;
    if (Math.abs(offset) === 2) return 0.6;
    return 0.3;
  };

  return (
    <div ref={containerRef} className={styles.wheelContainer}>
      <div className={styles.wheelTrack}>
        <AnimatePresence mode="popLayout">
          {visiblePrizes.map(({ prize, offset }) => {
            const marginClass = getMarginClass(offset);
            const isCentered = offset === 0;
            
            return (
              <motion.div
                key={`${offset}`}
                layout
                initial={{ scale: getScale(offset), opacity: getOpacity(offset) }}
                animate={{ 
                  scale: getScale(offset), 
                  opacity: getOpacity(offset)
                }}
                transition={{ 
                  duration: 1,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className={`${styles.prizeCard} ${marginClass}`}
                style={{ 
                  backgroundColor: prize.color,
                  zIndex: offset === 0 ? 3 : Math.abs(offset) === 1 ? 2 : 1
                }}
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
