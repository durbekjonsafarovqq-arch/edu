
import React, { useState, useEffect, useRef } from 'react';
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
  const [aiMessage, setAiMessage] = useState<string>("Yaxshi o'quvchi har doim intiladi...");
  const [loadingAi, setLoadingAi] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [questDone, setQuestDone] = useState<boolean>(() => {
    const lastClaimDate = localStorage.getItem(`last_bonus_date_${user.id}`);
    return lastClaimDate === getTodayDate();
  });

  const [seenTaskIds, setSeenTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`seen_tasks_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      if (localStorage.getItem(`last_bonus_date_${user.id}`) !== getTodayDate()) {
        setQuestDone(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    const fetchAi = async () => {
      setLoadingAi(true);
      const msg = await getMotivationalMessage(user.coins, user.name);
      setAiMessage(msg);
      setLoadingAi(false);
    };
    fetchAi();
  }, [user.id]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unseenTasks = tasks.filter(t => !seenTaskIds.includes(t.id));

  const handleClearNotifications = () => {
    const allCurrentTaskIds = tasks.map(t => t.id);
    const newSeenIds = Array.from(new Set([...seenTaskIds, ...allCurrentTaskIds]));
    setSeenTaskIds(newSeenIds);
    localStorage.setItem(`seen_tasks_${user.id}`, JSON.stringify(newSeenIds));
    setShowNotifications(false);
  };

  const sortedStudents = [...students].sort((a, b) => b.coins - a.coins);
  const chartData = sortedStudents.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    coins: s.coins,
    isMe: s.id === user.id
  }));

  const handleQuest = () => {
    if (!questDone) {
      updateCoins(user.id, 25);
      setQuestDone(true);
      localStorage.setItem(`last_bonus_date_${user.id}`, getTodayDate());
    }
  };

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - now;
    if (diff <= 0) return "Tugadi";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}s ${minutes}m`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-3 pb-4">
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-lg font-black text-slate-800 tracking-tighter leading-none">Salom, {user.name}! 👋</h1>
          <p className="text-slate-400 text-[9px] font-medium mt-1 uppercase tracking-widest">IT Sayohatingni boshla</p>
        </div>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
          >
            <span className="text-lg">🔔</span>
            {unseenTasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {unseenTasks.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Bildirishnomalar</span>
                {unseenTasks.length > 0 && (
                  <button onClick={handleClearNotifications} className="text-[8px] font-bold text-blue-600 hover:underline">O'chirish</button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {unseenTasks.length > 0 ? (
                  unseenTasks.map(t => (
                    <div key={t.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">Yangi vazifa: {t.title}</p>
                      <p className="text-[9px] text-emerald-500 font-bold mt-1">+{t.coins} EduCoin</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-[10px] font-medium">Hozircha yangi bildirishnomalar yo'q</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#0a0b1e] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-white/5">
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[2px] mb-3 opacity-60">IT Akademiya Balansi</h2>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md w-fit p-2.5 rounded-xl border border-white/10">
              <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-lg shadow-lg">🪙</div>
              <div>
                <p className="text-xl font-black leading-none">{user.coins}</p>
                <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest mt-1">EduCoin Jami</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-[10px] text-blue-600">🤖</div>
                 <span className="font-black text-slate-400 uppercase tracking-widest text-[7px]">AI Mentor</span>
              </div>
              <p className={`text-slate-600 italic leading-tight font-medium text-[11px] ${loadingAi ? 'animate-pulse bg-slate-50 h-8 rounded' : ''}`}>
                {loadingAi ? '' : `"${aiMessage}"`}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="font-black text-[8px] text-slate-400 uppercase tracking-widest mb-3">Reyting Top 5</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', padding: '5px', fontSize: '9px'}} />
                <Bar dataKey="coins" radius={[4, 4, 0, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isMe ? '#2563eb' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
           <div className="text-xl mb-1">{questDone ? '✅' : '🎁'}</div>
           <h3 className="font-black text-[9px] text-slate-800 uppercase tracking-widest mb-0.5">Kunlik Bonus</h3>
           <button 
             onClick={handleQuest}
             disabled={questDone}
             className={`w-full py-2 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all ${questDone ? 'bg-slate-50 text-emerald-500' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'}`}
           >
             {questDone ? 'Olingan' : 'Olish (+25)'}
           </button>
        </section>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-[9px] text-slate-800 uppercase tracking-widest">Mavjud Vazifalar</h3>
          <span className="text-[8px] font-bold text-slate-300">{tasks.length} faol</span>
        </div>
        <div className="divide-y divide-slate-50">
           {tasks.map(t => (
             <div key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-2.5">
                   <div className="w-7 h-7 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg text-sm relative">
                     📄
                     {!seenTaskIds.includes(t.id) && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 border-2 border-white rounded-full"></span>}
                   </div>
                   <div>
                      <p className="font-bold text-slate-800 text-[11px] group-hover:text-blue-600 transition-colors leading-none">{t.title}</p>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">⏱️ {formatTimeLeft(t.expiresAt)} qoldi</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-500 text-[10px]">+{t.coins}</span>
                  <button onClick={() => t.link && window.open(t.link, '_blank')} className="px-2.5 py-1 bg-blue-600 text-white font-black text-[8px] uppercase tracking-widest rounded-md hover:bg-blue-700">O'tish</button>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
