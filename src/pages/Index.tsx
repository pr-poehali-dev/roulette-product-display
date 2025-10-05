import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PrizeWheel from '@/components/PrizeWheel';
import ProductGallery from '@/components/ProductGallery';

const prizes = [
  { id: 1, text: '-35%', type: 'discount', color: '#4A90E2', description: 'Скидка на первый заказ' },
  { id: 2, text: '-20%', type: 'discount', color: '#D2691E', description: 'Скидка на категорию' },
  { id: 3, text: 'Наушники', type: 'product', color: '#F5F5F5', emoji: '🎧', description: 'Наушники Commo за 1₽' },
  { id: 4, text: 'Semily', type: 'product', color: '#228B22', emoji: '🧴', description: 'Скидка 20% на косметику Semily' },
  { id: 5, text: 'Pantene', type: 'product', color: '#6A8CC7', emoji: '🧴', description: 'Набор Pantene со скидкой' },
  { id: 6, text: '-30%', type: 'discount', color: '#5B7FBF', description: 'Скидка на заказ' },
  { id: 7, text: '-20%', type: 'discount', color: '#8B4513', description: 'Скидка на бакалею' },
  { id: 8, text: '+500', type: 'coins', color: '#FFD700', emoji: '🪙', description: 'Бонусные монеты' },
];

export default function Index() {
  const [coins, setCoins] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<typeof prizes[0] | null>(null);

  const spinWheel = () => {
    if (coins < 10 || isSpinning) return;

    setCoins(coins - 10);
    setIsSpinning(true);
    setWonPrize(null);

    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setIsSpinning(false);
      setWonPrize(randomPrize);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <ProductGallery />
    </div>
  );
}