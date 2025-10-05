import { FC } from 'react';
import styles from './DiscountSticker.module.css';

interface DiscountStickerProps {
  type: 'percent' | 'price';
  value: string;
  color?: 'purple' | 'orange' | 'blue' | 'green';
}

const DiscountSticker: FC<DiscountStickerProps> = ({ 
  type, 
  value, 
  color = 'purple' 
}) => {
  return (
    <div className={`${styles.sticker} ${styles[color]}`}>
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
