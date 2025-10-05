import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
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
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (isSpinning && swiperRef.current) {
      swiperRef.current.autoplay.stop();
    } else if (!isSpinning && swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  }, [isSpinning]);

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.indicator}>▼</div>
      
      <Swiper
        modules={[Autoplay]}
        direction="vertical"
        slidesPerView={1.5}
        centeredSlides={true}
        loop={true}
        speed={800}
        autoplay={{
          delay: 1300,
          disableOnInteraction: false,
          reverseDirection: false
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className={styles.swiperContainer}
        breakpoints={{
          768: {
            direction: 'horizontal',
            slidesPerView: 1.5
          }
        }}
      >
        {prizes.map((prize) => (
          <SwiperSlide key={prize.id} className={styles.slideWrapper}>
            <div
              className={styles.prizeCard}
              style={{ backgroundColor: prize.color }}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
