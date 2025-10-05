import { FC } from 'react';
import styles from './DiscountSticker.module.css';

interface DiscountStickerProps {
  type: 'percent' | 'price';
  value: string;
  color?: 'purple' | 'orange' | 'blue' | 'green';
}

const stickerImages = {
  purple: 'https://cdn.poehali.dev/files/dfb912f3-26db-43f8-9ec9-c00be2655de9.png',
  orange: 'https://cdn.poehali.dev/files/4159f1c7-a291-4766-ac35-35d3e9ef32c1.png',
  blue: 'https://cdn.poehali.dev/files/dfb912f3-26db-43f8-9ec9-c00be2655de9.png',
  green: 'https://cdn.poehali.dev/files/4159f1c7-a291-4766-ac35-35d3e9ef32c1.png',
};

const DiscountSticker: FC<DiscountStickerProps> = ({ 
  type, 
  value, 
  color = 'purple' 
}) => {
  return (
    <div className={styles.stickerWrapper}>
      <img 
        src={stickerImages[color]} 
        alt="sticker" 
        className={styles.stickerImage}
      />
      <div className={styles.content}>
        {type === 'percent' ? (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.percent}>%</span>
          </>
        ) : (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.currency}>₽</span>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountSticker;