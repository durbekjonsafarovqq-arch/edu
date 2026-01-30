
import React, { useState } from 'react';
import { User, Task } from '../types';

interface Props {
  students: User[];
  updateCoins: (id: string, amount: number) => void;
  tasks: Task[];
}

const TeacherDashboard: React.FC<Props> = ({ students, updateCoins, tasks }) => {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">Salom, Domla! 👋</h2>
          <p className="text-slate-400 font-medium">Bugun o'quvchilarda qanday o'zgarishlar bor?</p>
        </div>
        <div className="flex gap-6">
          <StatCard icon="👥" label="O'quvchilar" value={students.length} color="indigo" />
          <StatCard icon="💎" label="Jami tangalar" value={students.reduce((a, b) => a + b.coins, 0)} color="amber" />
        </div>
      </header>

      <section className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-800">Tezkor mukofotlash</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">F.I.SH</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Balans</th>
                <th className="px-10 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={s.avatar} className="w-12 h-12 rounded-2xl bg-white border border-slate-200" alt="" />
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-black text-sm">🪙 {s.coins}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => setSelectedStudent(s)}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-50 hover:bg-indigo-700 transition-all text-sm"
                    >
                      Mukofotlash
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-1">Mukofotlash</h3>
                <p className="text-indigo-500 font-bold">{selectedStudent.name}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-3xl text-slate-300 hover:text-slate-500">&times;</button>
            </div>
            
            <div className="space-y-3">
              {tasks.map(t => (
                <button 
                  key={t.id}
                  onClick={() => { updateCoins(selectedStudent.id, t.coins); setSelectedStudent(null); }}
                  className="w-full flex justify-between items-center p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                >
                   <span className="font-bold text-slate-700 group-hover:text-indigo-600">{t.title}</span>
                   <span className="font-black text-emerald-500">+{t.coins} 🪙</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: string, label: string, value: number, color: string }) => {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} flex items-center gap-5 min-w-[200px]`}>
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="text-2xl font-black leading-none">{value}</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
