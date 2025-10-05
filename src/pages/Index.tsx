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
    <div className="min-h-screen md:min-h-screen max-md:h-screen max-md:overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 md:py-6 max-md:py-0 max-w-full max-md:h-full max-md:flex max-md:flex-col">
        <div className="flex items-center justify-between md:mb-8 max-md:mb-0 px-6 md:relative">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg md:flex max-md:hidden">
            <span className="text-3xl font-black text-gray-800">{coins}</span>
            <span className="text-2xl">🪙</span>
          </div>

          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg md:hidden flex items-center gap-1.5 z-50">
            <span className="text-lg font-black text-gray-800">{coins}</span>
            <span className="text-base">🪙</span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-4 max-md:absolute max-md:top-2 max-md:right-2 max-md:mt-12 z-50">
            <button className="flex flex-col items-center gap-0.5 hover:scale-105 transition-transform">
              <div className="w-14 h-14 md:w-14 md:h-14 max-md:w-10 max-md:h-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-3xl max-md:text-xl">
                🎁
              </div>
              <span className="text-white text-[10px] md:text-sm font-semibold drop-shadow-lg">Призы</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 hover:scale-105 transition-transform">
              <div className="w-14 h-14 md:w-14 md:h-14 max-md:w-10 max-md:h-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-3xl max-md:text-xl">
                🎯
              </div>
              <span className="text-white text-[10px] md:text-sm font-semibold drop-shadow-lg text-center leading-tight">Задания<br className="md:block"/>и игры</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 hover:scale-105 transition-transform">
              <div className="w-14 h-14 md:w-14 md:h-14 max-md:w-10 max-md:h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg flex items-center justify-center text-white max-md:text-[8px] text-xs font-black px-1 text-center leading-tight">
                ЗАБИРАЙТЕ
              </div>
              <span className="text-white text-[10px] md:text-sm font-semibold drop-shadow-lg text-center leading-tight">Монетки<br className="md:block"/>за вход</span>
            </button>
          </div>
        </div>

        <div className="max-md:flex-1 max-md:flex max-md:items-center">
          <PrizeWheel 
            prizes={prizes}
            isSpinning={isSpinning}
            onSpinComplete={(prize) => setWonPrize(prize)}
          />
        </div>

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

        <div className="max-w-2xl mx-auto px-6 max-md:pb-4">
          <Button
            onClick={spinWheel}
            disabled={coins < 10 || isSpinning}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 md:py-8 max-md:py-6 rounded-2xl shadow-2xl md:text-2xl max-md:text-xl font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
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