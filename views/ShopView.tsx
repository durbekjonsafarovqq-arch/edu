
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
      alert("⚠️ Tangalar yetarli emas!");
    }
  };

  const categories = [
    { id: 'TECH', name: 'IT Gadjetlar', icon: '💻' },
    { id: 'EDU', name: 'Bonuslar', icon: '📚' }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tighter">EduShop 🛒</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Bilimni texnologiyalarga almashtir</p>
        </div>
        <div className="bg-amber-500 px-4 py-2 rounded-lg text-white flex items-center gap-2 shadow-lg shadow-amber-50 border-b-2 border-amber-600 active:translate-y-0.5 transition-all">
           <span className="text-lg">🪙</span>
           <div>
             <p className="text-[6px] font-black text-amber-100 uppercase tracking-widest leading-none mb-0.5">Balans</p>
             <p className="text-sm font-black leading-none">{user.coins}</p>
           </div>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{cat.icon}</span>
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{cat.name}</h3>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {rewards.filter(r => r.category === cat.id).map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center p-2.5 group relative overflow-hidden">
                <div className="w-full aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden relative border border-slate-50">
                  <img 
                    src={r.icon} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt={r.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?q=80&w=200&auto=format&fit=crop'; }}
                  />
                </div>
                <h3 className="text-[10px] font-black text-slate-800 mb-0.5 text-center truncate w-full">{r.title}</h3>
                <p className="text-[8px] font-medium text-slate-400 mb-2 text-center line-clamp-1 leading-tight">{r.description}</p>
                <button 
                  onClick={() => handleBuy(r)}
                  className={`w-full py-1.5 rounded-lg font-black uppercase tracking-widest text-[7px] transition-all ${
                    purchased === r.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {purchased === r.id ? 'OK' : `${r.cost} 🪙`}
                </button>
                {purchased === r.id && <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <p className="font-black text-[8px] text-emerald-600 uppercase tracking-widest">Sotib olindi!</p>
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
