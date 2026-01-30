
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Task } from '../types';
import { getMotivationalMessage } from '../geminiService';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  user: User;
  students: User[];
  updateCoins: (id: string, amount: number) => void;
  tasks: Task[];
}

const StudentDashboard: React.FC<Props> = ({ user, students, updateCoins, tasks }) => {
  const navigate = useNavigate();
  const [aiMessage, setAiMessage] = useState<string>("Tizim yuklanmoqda...");
  const [loadingAi, setLoadingAi] = useState(true);
  const [now, setNow] = useState(Date.now());
  
  // Get today's date as a string (YYYY-MM-DD)
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Initialize quest state from localStorage
  const [questDone, setQuestDone] = useState<boolean>(() => {
    const lastClaimDate = localStorage.getItem(`last_bonus_date_${user.id}`);
    return lastClaimDate === getTodayDate();
  });

  // State to track seen task IDs to clear notification badge
  const [seenTaskIds, setSeenTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`seen_tasks_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      // Check if day has changed while user is on the page
      const currentToday = getTodayDate();
      const lastClaim = localStorage.getItem(`last_bonus_date_${user.id}`);
      if (lastClaim !== currentToday) {
        setQuestDone(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user.id]);

  const fetchAi = async () => {
    setLoadingAi(true);
    const msg = await getMotivationalMessage(user.coins, user.name);
    setAiMessage(msg);
    setLoadingAi(false);
  };

  useEffect(() => {
    fetchAi();
  }, [user.id]);

  // Calculate unseen tasks for the badge
  const unseenTasksCount = tasks.filter(t => !seenTaskIds.includes(t.id)).length;

  const handleClearNotifications = () => {
    const allCurrentTaskIds = tasks.map(t => t.id);
    const newSeenIds = Array.from(new Set([...seenTaskIds, ...allCurrentTaskIds]));
    setSeenTaskIds(newSeenIds);
    localStorage.setItem(`seen_tasks_${user.id}`, JSON.stringify(newSeenIds));
  };

  const sortedStudents = [...students].sort((a, b) => b.coins - a.coins);
  const myRank = sortedStudents.findIndex(s => s.id === user.id) + 1;
  const chartData = sortedStudents.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    coins: s.coins,
    isMe: s.id === user.id
  }));

  const handleQuest = () => {
    const today = getTodayDate();
    const lastClaim = localStorage.getItem(`last_bonus_date_${user.id}`);

    if (lastClaim !== today) {
      updateCoins(user.id, 25);
      setQuestDone(true);
      localStorage.setItem(`last_bonus_date_${user.id}`, today);
    } else {
      alert("Siz bugungi bonusni olib bo'lgansiz! Ertaga qaytib keling. 🌙");
    }
  };

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - now;
    if (diff <= 0) return "Tugadi";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}s ${minutes}m ${seconds}s`;
  };

  const openTaskLink = (e: React.MouseEvent, link?: string) => {
    e.stopPropagation();
    if (!link || link === '#' || link.trim() === '') {
      alert("⚠️ Bu vazifa uchun havola (link) biriktirilmagan.");
      return;
    }
    let url = link.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">O'quvchi Paneli</h1>
          <p className="text-slate-400 font-medium">Shaxsiy natijalar va yangi vazifalar</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleClearNotifications}
            className="relative p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group focus:outline-none"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform inline-block">🔔</span>
            {unseenTasksCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {unseenTasksCount}
              </span>
            )}
            
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 opacity-0 group-focus:opacity-100 pointer-events-none group-focus:pointer-events-auto transition-all z-50 translate-y-2 group-focus:translate-y-0 scale-95 group-focus:scale-100">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Yangi Vazifalar</p>
                {unseenTasksCount > 0 && <span className="bg-blue-100 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">YANGI</span>}
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {tasks.length > 0 ? tasks.slice(0, 5).map(t => (
                  <div key={t.id} onClick={(e) => openTaskLink(e, t.link)} className="group/item text-[11px] font-bold text-slate-600 flex justify-between items-center cursor-pointer hover:text-blue-600 transition-colors">
                    <span className="truncate mr-4 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${seenTaskIds.includes(t.id) ? 'bg-slate-200' : 'bg-blue-500'}`}></span>
                      {t.title}
                    </span>
                    <span className="text-blue-500 shrink-0 font-black">+{t.coins} 🪙</span>
                  </div>
                )) : (
                  <p className="text-[10px] text-slate-400 text-center py-4">Hozircha vazifalar yo'q</p>
                )}
                {tasks.length > 5 && <p className="text-[9px] text-slate-300 text-center pt-2">Barchasini ko'rish uchun pastga tushing</p>}
              </div>
            </div>
          </button>
        </div>
      </div>

      <header className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0b1e] rounded-[48px] p-12 text-white shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] relative overflow-hidden border border-white/10">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-3 tracking-tighter">Xush kelibsiz, {user.name}! 🚀</h2>
            <p className="text-blue-300 text-lg mb-10 font-medium">Sizning IT sayohatingiz davom etmoqda.</p>
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-2xl w-fit p-6 rounded-[32px] border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🪙</div>
              <div>
                <p className="text-5xl font-black leading-none">{user.coins}</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[4px] mt-2">EduCoin Balansi</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="bg-white rounded-[48px] p-10 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">✨</div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">AI Mentor</span>
             </div>
             <p className={`text-slate-600 italic leading-relaxed font-medium text-lg ${loadingAi ? 'animate-pulse bg-slate-100 rounded-xl h-20' : ''}`}>
               {loadingAi ? '' : `"${aiMessage}"`}
             </p>
          </div>
          <button 
            onClick={fetchAi} 
            disabled={loadingAi}
            className="mt-8 text-[11px] font-black text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all uppercase tracking-[2px] disabled:opacity-50"
          >
            {loadingAi ? 'Yuklanmoqda...' : 'Yangi maslahat olish 🔄'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
             <h3 className="font-black text-2xl text-slate-800">Top Akademiya Reytingi</h3>
             <span className="text-xs font-black text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full uppercase tracking-widest">
               Siz: #{myRank}-o'rin
             </span>
          </div>
          <div className="h-80 p-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Bar dataKey="coins" radius={[12, 12, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isMe ? '#2563eb' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-[48px] p-10 shadow-sm border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-10">
             <h3 className="font-black text-2xl text-slate-800">IT Quest 🎯</h3>
             <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg uppercase tracking-widest">Kunlik</span>
           </div>
           
           <div className={`p-8 rounded-[32px] flex-1 flex flex-col items-center justify-center text-center transition-all ${questDone ? 'bg-emerald-50 border-emerald-100 border' : 'bg-slate-50 border-slate-100 border hover:shadow-xl'}`}>
              <div className="text-5xl mb-6">{questDone ? '✅' : '❓'}</div>
              <p className="font-bold text-slate-800 mb-4">{questDone ? 'Kunlik IT bonus olindi!' : 'Bugun o\'z balansingni IT bonus bilan to\'ldirmoqchimisan?'}</p>
              <button 
                onClick={handleQuest}
                disabled={questDone}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${questDone ? 'bg-white text-emerald-500 shadow-sm cursor-default' : 'bg-blue-600 text-white shadow-xl hover:bg-blue-700 active:scale-95'}`}
              >
                {questDone ? 'Bonus olingan' : 'Bonusni olish (+25)'}
              </button>
              {questDone && (
                <p className="text-[10px] text-emerald-600 font-bold mt-4 uppercase tracking-widest">
                  Keyingi bonus ertaga 🌙
                </p>
              )}
           </div>
        </section>
      </div>

      <section className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-2xl text-slate-800">Faol Vazifalar</h3>
          <span className="text-xs font-bold text-slate-400">{tasks.length} ta mavjud</span>
        </div>
        <div className="divide-y divide-slate-50">
           {tasks.map(t => (
             <div 
               key={t.id} 
               onClick={(e) => { handleClearNotifications(); openTaskLink(e, t.link); }}
               className="p-8 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-all group"
             >
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-[20px] text-xl group-hover:scale-110 transition-transform relative">
                     {t.link && t.link !== '#' ? '📖' : '⏳'}
                     {!seenTaskIds.includes(t.id) && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>}
                   </div>
                   <div>
                      <p className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                        {t.title}
                        {t.link && t.link !== '#' && <span className="ml-3 text-[10px] font-black text-blue-400 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-widest">Link Mavjud</span>}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        ⏱️ Qolgan vaqt: <span className="text-red-500">{formatTimeLeft(t.expiresAt)}</span>
                      </p>
                   </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div className="hidden md:block">
                    <span className="block font-black text-emerald-500 text-xl">+{t.coins} 🪙</span>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Mukofot</p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100 group-hover:bg-blue-700 transition-colors">
                    OCHISH ↗
                  </button>
                </div>
             </div>
           ))}
           {tasks.length === 0 && (
             <div className="p-20 text-center">
               <span className="text-5xl mb-4 inline-block">😴</span>
               <p className="text-slate-400 font-bold">Hozircha yangi vazifalar yo'q. Dam oling!</p>
             </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
