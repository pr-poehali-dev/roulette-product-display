import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PrizeWheel from '@/components/PrizeWheel';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
            <span className="text-3xl font-black text-gray-800">{coins}</span>
            <span className="text-2xl">🪙</span>
          </div>

          <div className="flex gap-4">
            <button className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-3xl">
                🎁
              </div>
              <span className="text-white text-sm font-semibold drop-shadow-lg">Призы</span>
            </button>

            <button className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-3xl">
                🎯
              </div>
              <span className="text-white text-sm font-semibold drop-shadow-lg">Задания<br/>и игры</span>
            </button>

            <button className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-lg flex items-center justify-center text-white text-xs font-black px-2 text-center leading-tight">
                ЗАБИРАЙТЕ
              </div>
              <span className="text-white text-sm font-semibold drop-shadow-lg">Монетки<br/>за вход</span>
            </button>
          </div>
        </div>

        <PrizeWheel 
          prizes={prizes}
          isSpinning={isSpinning}
          onSpinComplete={(prize) => setWonPrize(prize)}
        />

        {wonPrize && (
          <div className="mb-6 animate-bounce-in">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                {wonPrize.emoji && <span className="text-5xl">{wonPrize.emoji}</span>}
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-semibold mb-1">{wonPrize.description?.toUpperCase()}</div>
                  <div className="text-3xl font-black" style={{ color: wonPrize.color }}>
                    {wonPrize.text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <Button
            onClick={spinWheel}
            disabled={coins < 10 || isSpinning}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-8 rounded-2xl shadow-2xl text-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-3">
              {isSpinning ? (
                'КРУТИТСЯ...'
              ) : coins < 10 ? (
                <>НЕ ХВАТАЕТ МОНЕТ</>
              ) : (
                <>НУЖНО 10 🪙</>
              )}
            </span>
          </Button>

          <div className="text-center mt-6">
            <p className="text-white text-sm drop-shadow-lg">
              Нажимая «Вращать», я соглашаюсь с{' '}
              <a href="#" className="underline">Условиями акции</a>,{' '}
              <a href="#" className="underline">Правилами сервиса</a> и{' '}
              <a href="#" className="underline">Политикой</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}