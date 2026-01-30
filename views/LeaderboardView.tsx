
import React from 'react';
import { User } from '../types';

interface Props {
  students: User[];
  currentUser: User;
}

const LeaderboardView: React.FC<Props> = ({ students, currentUser }) => {
  const sorted = [...students].sort((a, b) => b.coins - a.coins);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-800 mb-4">Reyting 🏆</h2>
        <p className="text-slate-400 text-lg font-medium">Eng bilimdon va faol o'quvchilar</p>
      </header>

      <div className="space-y-4">
        {sorted.map((s, index) => {
          const isTop3 = index < 3;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
          const isMe = s.id === currentUser.id;

          return (
            <div 
              key={s.id} 
              className={`flex items-center gap-6 p-6 rounded-[32px] transition-all border ${
                isMe ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 border-indigo-600 scale-[1.02]' : 'bg-white text-slate-700 shadow-sm border-slate-100 hover:shadow-md'
              }`}
            >
              <div className="w-12 text-center font-black text-2xl">
                {medal || `#${index + 1}`}
              </div>
              <img src={s.avatar} className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200" alt="" />
              <div className="flex-1">
                <p className={`font-black text-lg ${isMe ? 'text-white' : 'text-slate-800'}`}>{s.name}</p>
                <p className={`text-xs ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>Bilim darajasi: {s.coins > 200 ? 'A' : 'B'}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black ${isMe ? 'text-white' : 'text-indigo-600'}`}>🪙 {s.coins}</p>
                <p className={`text-[10px] uppercase font-black tracking-widest ${isMe ? 'text-indigo-200' : 'text-slate-300'}`}>EduCoins</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardView;
