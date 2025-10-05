import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PrizeWheel from '@/components/PrizeWheel';
import ProductGallery from '@/components/ProductGallery';

const prizes = [
  { id: 1, text: 'BYBIT', type: 'product', color: '#1a1f2e', image: 'https://cdn.poehali.dev/files/51e9f46f-7515-4069-9a4f-609e5c3d3f4b.png', description: 'Торговая платформа', discount: { type: 'percent', value: 20, badge: 'orange' } },
  { id: 2, text: 'Product 2', type: 'product', color: '#a3e635', image: 'https://cdn.poehali.dev/files/37b1984d-b698-4108-a1ba-628d101ae93e.png', description: 'Зелёный продукт', discount: { type: 'percent', value: 35, badge: 'purple' } },
  { id: 3, text: 'Product 3', type: 'product', color: '#ef4444', image: 'https://cdn.poehali.dev/files/865ad27e-3dce-4b2e-92b7-63aebee30183.png', description: 'Красный продукт' },
  { id: 4, text: 'Product 4', type: 'product', color: '#a855f7', image: 'https://cdn.poehali.dev/files/6a9337b5-b7d7-4642-b210-55676cb99989.png', description: 'Фиолетовый продукт', discount: { type: 'ruble', value: 500, badge: 'orange' } },
  { id: 5, text: 'KYC SIM', type: 'product', color: '#1f2937', image: 'https://cdn.poehali.dev/files/58b19872-84ad-4492-8737-c175bb0a6944.png', description: 'Сим-карта HEY, KYC!' },
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