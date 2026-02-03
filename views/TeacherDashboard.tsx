
import React, { useState } from 'react';
import { User, Task, HomeworkSubmission } from '../types';

interface Props {
  students: User[];
  updateCoins: (id: string, amount: number) => void;
  tasks: Task[];
  submissions: HomeworkSubmission[];
  approveSubmission: (id: string) => void;
  rejectSubmission: (id: string) => void;
}

const TeacherDashboard: React.FC<Props> = ({ students, updateCoins, tasks, submissions, approveSubmission, rejectSubmission }) => {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [tab, setTab] = useState<'students' | 'submissions'>('students');

  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING');

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-700">
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-none">Ustoz Paneli 👋</h2>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setTab('students')}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              O'quvchilar ({students.length})
            </button>
            <button 
              onClick={() => setTab('submissions')}
              className={`relative text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${tab === 'submissions' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Kelgan Vazifalar
              {pendingSubmissions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] flex items-center justify-center rounded-full border border-white">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
            <span className="text-xl">👥</span>
            <span className="font-black text-indigo-600 text-sm">{students.length}</span>
          </div>
        </div>
      </header>

      {tab === 'students' ? (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-5 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">F.I.SH</th>
                  <th className="px-5 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">Balans</th>
                  <th className="px-5 py-3 text-right text-[8px] font-black text-slate-400 uppercase tracking-widest">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatar} className="w-7 h-7 rounded-lg bg-white border border-slate-100" alt="" />
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">{s.name}</p>
                          <p className="text-[8px] text-slate-400 leading-none">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md font-black text-[9px]">🪙 {s.coins}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => setSelectedStudent(s)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all text-[8px] uppercase tracking-widest"
                      >
                        Tanga berish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          {pendingSubmissions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              Yangi vazifalar yo'q 🍃
            </div>
          ) : (
            pendingSubmissions.map(sub => (
              <div key={sub.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-left-4">
                <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                  {sub.image ? (
                    <img src={sub.image} className="w-full h-full object-cover cursor-zoom-in" onClick={() => window.open(sub.image)} alt="Homework" title="Kattalashtirish" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📄</div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[11px] font-black text-slate-800">{sub.studentName}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{sub.taskTitle}</p>
                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <a href={sub.link} target="_blank" rel="noreferrer" className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-all uppercase">Linkni ochish 🔗</a>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => approveSubmission(sub.id)}
                    className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all"
                  >
                    Tasdiqlash ✅
                  </button>
                  <button 
                    onClick={() => rejectSubmission(sub.id)}
                    className="px-4 py-2 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    Rad etish ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-md font-black text-slate-800">Tangalar berish</h3>
                <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest">{selectedStudent.name}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-1.5">
              {tasks.length > 0 ? tasks.map(t => (
                <button 
                  key={t.id}
                  onClick={() => { updateCoins(selectedStudent.id, t.coins); setSelectedStudent(null); }}
                  className="w-full flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100"
                >
                   <span className="font-bold text-slate-600 text-[10px] group-hover:text-blue-600">{t.title}</span>
                   <span className="font-black text-emerald-500 text-[10px]">+{t.coins}</span>
                </button>
              )) : (
                <p className="text-[10px] text-slate-400 text-center py-4">Hozircha faol vazifalar yo'q. Avval vazifa yarating.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
