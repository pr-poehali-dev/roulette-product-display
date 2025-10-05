import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const prizes = [
  { id: 1, text: '-99%', type: 'discount', color: '#9b87f5' },
  { id: 2, text: 'Робинзон\nHedgren', type: 'product', color: '#F5A962', emoji: '🎒' },
  { id: 3, text: '-20%', type: 'discount', color: '#4A90E2' },
  { id: 4, text: '-150₽', type: 'cashback', color: '#4FEDIC4' },
  { id: 5, text: '1000₽', type: 'money', color: '#FF8B94' },
  { id: 6, text: '-25%', type: 'discount', color: '#FF6B6B' },
  { id: 7, text: 'Инза', type: 'product', color: '#FFE66D', emoji: '🍫' },
  { id: 8, text: '+500', type: 'coins', color: '#A8E6CF', emoji: '🪙' },
];

export default function Index() {
  const [coins, setCoins] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof prizes[0] | null>(null);

  const spinWheel = () => {
    if (coins < 10 || isSpinning) return;

    setCoins(coins - 10);
    setIsSpinning(true);
    setWonPrize(null);

    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const prizeIndex = prizes.indexOf(randomPrize);
    const segmentAngle = 360 / prizes.length;
    const targetRotation = 360 * 5 + (prizeIndex * segmentAngle) + segmentAngle / 2;
    
    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(randomPrize);
    }, 3000);
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

        <div className="relative flex items-center justify-center mb-8">
          <div className="relative">
            <div 
              className="relative w-[500px] h-[500px]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {prizes.map((prize, index) => {
                  const segmentAngle = 360 / prizes.length;
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                  
                  const x1 = 100 + 100 * Math.cos(startAngle);
                  const y1 = 100 + 100 * Math.sin(startAngle);
                  const x2 = 100 + 100 * Math.cos(endAngle);
                  const y2 = 100 + 100 * Math.sin(endAngle);
                  
                  const midAngle = startAngle + (endAngle - startAngle) / 2;
                  const textX = 100 + 65 * Math.cos(midAngle);
                  const textY = 100 + 65 * Math.sin(midAngle);

                  return (
                    <g key={prize.id}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="white"
                        strokeWidth="3"
                        className="drop-shadow-xl"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="900"
                        className="drop-shadow-lg"
                        transform={`rotate(${index * segmentAngle}, ${textX}, ${textY})`}
                      >
                        {prize.emoji ? (
                          <tspan fontSize="20">{prize.emoji}</tspan>
                        ) : (
                          prize.text.split('\n').map((line, i) => (
                            <tspan key={i} x={textX} dy={i === 0 ? 0 : 16}>
                              {line}
                            </tspan>
                          ))
                        )}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl border-4 border-orange-500 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
              </div>
            </div>

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[32px] border-t-white drop-shadow-2xl" />
            </div>
          </div>
        </div>

        {wonPrize && (
          <div className="mb-6 animate-bounce-in">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                {wonPrize.emoji && <span className="text-5xl">{wonPrize.emoji}</span>}
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-semibold mb-1">СКИДКА НА ЗАКАЗ В ЛАВКЕ</div>
                  <div className="text-3xl font-black" style={{ color: wonPrize.color }}>
                    {wonPrize.text.replace('\n', ' ')}
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
