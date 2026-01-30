
import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  addTask: (title: string, coins: number, category: string, link?: string) => void;
}

const TasksView: React.FC<Props> = ({ tasks, addTask }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [coins, setCoins] = useState(10);
  const [category, setCategory] = useState('Dars');
  const [link, setLink] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - now;
    if (diff <= 0) return "Tugadi";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}s ${minutes}m ${seconds}s`;
  };

  const handleAddTask = () => {
    if (title.trim()) {
      addTask(title, coins, category, link);
      setShowAdd(false);
      setTitle('');
      setLink('');
      setCoins(10);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Topshiriqlar</h2>
          <p className="text-slate-400 font-medium">Har bir vazifa 24 soatdan so'ng o'chib ketadi</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-2"
        >
          <span>✨</span> Yangi Vazifa (24h)
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Kategoriya</th>
              <th className="px-10 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Vazifa nomi</th>
              <th className="px-10 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Qolgan Vaqt</th>
              <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Mukofot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.map(t => (
              <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">{t.category}</span>
                </td>
                <td className="px-10 py-6 font-bold text-slate-700">
                  {t.title}
                  {t.link && t.link !== '#' && <span className="ml-2 text-[10px] text-blue-400">🔗 Link bor</span>}
                </td>
                <td className="px-10 py-6 text-center">
                   <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs">
                     ⏱️ {formatTimeLeft(t.expiresAt)}
                   </span>
                </td>
                <td className="px-10 py-6 text-right font-black text-emerald-500">+{t.coins} 🪙</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 font-bold">Faol vazifalar yo'q. Yangisini qo'shing!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-8">Yangi topshiriq (24 soatga)</h3>
            <div className="space-y-4 mb-8">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Vazifa nomi" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500 font-medium" />
              <input type="number" value={coins} onChange={e => setCoins(parseInt(e.target.value))} placeholder="Tanga miqdori" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500 font-medium" />
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="Vazifa linki (PDF, Video, Docs)" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500 font-medium" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500 font-medium">
                <option value="Dars">Dars</option>
                <option value="Faollik">Faollik</option>
                <option value="Loyiha">Loyiha</option>
                <option value="IT Challenge">IT Challenge</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-4 font-bold text-slate-400">Bekor qilish</button>
              <button onClick={handleAddTask} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
