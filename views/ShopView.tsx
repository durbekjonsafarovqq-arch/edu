
import React, { useState } from 'react';
import { User, Reward } from '../types';

interface Props {
  user: User;
  rewards: Reward[];
  updateCoins: (id: string, amount: number) => void;
}

const ShopView: React.FC<Props> = ({ user, rewards, updateCoins }) => {
  const [purchased, setPurchased] = useState<string | null>(null);

  const handleBuy = (reward: Reward) => {
    if (user.coins >= reward.cost) {
      updateCoins(user.id, -reward.cost);
      setPurchased(reward.id);
      setTimeout(() => setPurchased(null), 3000);
    } else {
      alert("⚠️ Tangalar yetarli emas! Ko'proq vazifa bajaring va tanga yig'ing.");
    }
  };

  const categories = [
    { id: 'TECH', name: 'IT Gadjetlar', icon: '💻' },
    { id: 'EDU', name: 'O\'quv Imtiyozlari', icon: '📚' }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 mb-3 tracking-tighter">EduShop 🛒</h2>
          <p className="text-slate-400 font-bold text-lg">Bilimni haqiqiy texnologiyalarga almashtiring</p>
        </div>
        <div className="bg-gradient-to-tr from-amber-400 to-amber-600 px-12 py-6 rounded-[32px] text-white flex items-center gap-6 shadow-2xl shadow-amber-200 border-b-4 border-amber-700 active:translate-y-1 transition-all">
           <span className="text-5xl animate-bounce">🪙</span>
           <div>
             <p className="text-[10px] font-black text-amber-100 uppercase tracking-[4px] leading-none mb-2">Balans</p>
             <p className="text-4xl font-black leading-none">{user.coins}</p>
           </div>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-3xl">{cat.icon}</span>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-widest">{cat.name}</h3>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {rewards.filter(r => r.category === cat.id).map(r => (
              <div key={r.id} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all flex flex-col items-center text-center relative group">
                <div className="w-28 h-28 bg-slate-50 rounded-[40px] flex items-center justify-center text-6xl mb-8 group-hover:scale-110 transition-transform group-hover:rotate-6 shadow-inner">
                  {r.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{r.title}</h3>
                <p className="text-sm font-medium text-slate-400 mb-10 flex-1 leading-relaxed">{r.description}</p>
                <button 
                  onClick={() => handleBuy(r)}
                  className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[2px] text-xs transition-all ${
                    purchased === r.id 
                    ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-xl' 
                    : 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
                  }`}
                >
                  {purchased === r.id ? 'Sotib olindi! ✅' : `Olish: ${r.cost} Tanga`}
                </button>
                {purchased === r.id && <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-[48px] flex flex-col items-center justify-center animate-in fade-in zoom-in">
                  <span className="text-6xl mb-4 animate-bounce">🎁</span>
                  <p className="font-black text-emerald-600 uppercase tracking-widest">Tabriklaymiz!</p>
                </div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopView;
