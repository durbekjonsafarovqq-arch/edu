
import React, { useState } from 'react';
import { User, Task, HomeworkSubmission } from '../types';

interface Props {
  user: User;
  tasks: Task[];
  submissions: HomeworkSubmission[];
  addSubmission: (submission: HomeworkSubmission) => void;
}

const HomeworkView: React.FC<Props> = ({ user, tasks, submissions, addSubmission }) => {
  const [selectedTask, setSelectedTask] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const mySubmissions = submissions.filter(s => s.studentId === user.id);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !link) {
      alert("Iltimos, vazifani tanlang va havolani kiriting!");
      return;
    }

    const task = tasks.find(t => t.id === selectedTask);
    
    const newSubmission: HomeworkSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      taskId: selectedTask,
      taskTitle: task?.title || 'Noma`lum vazifa',
      link: link,
      image: image || undefined,
      status: 'PENDING',
      submittedAt: Date.now()
    };

    addSubmission(newSubmission);
    setStatus('success');
    
    // Reset form after success
    setTimeout(() => {
      setStatus('idle');
      setLink('');
      setSelectedTask('');
      setImage(null);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topshirish Formasi */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-5">
            <h2 className="text-lg font-black text-slate-800 tracking-tighter">Vazifa Topshirish 📝</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vazifa natijasini shu yerga yuboring</p>
          </div>

          {status === 'success' ? (
            <div className="py-16 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
              <h3 className="font-black text-slate-800">Yuborildi!</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Ustoz tekshirishini kuting</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Qaysi vazifa?</label>
                <select 
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 ring-blue-500 transition-all"
                >
                  <option value="">-- Tanlang --</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title} (+{t.coins} 🪙)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Ish havolasi (GitHub/Drive/Figma)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Natija rasmi (Screenshot)</label>
                <div className="relative group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="hw-img" />
                  <label htmlFor="hw-img" className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl cursor-pointer group-hover:bg-slate-100 group-hover:border-blue-300 transition-all overflow-hidden">
                    {image ? (
                      <img src={image} className="w-full h-full object-contain p-2" alt="Preview" />
                    ) : (
                      <>
                        <span className="text-2xl mb-1">🖼️</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rasm tanlash</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-50 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Topshirish 🚀
              </button>
            </form>
          )}
        </section>

        {/* Tarix Bo'limi */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-5">
            <h2 className="text-lg font-black text-slate-800 tracking-tighter">Mening Tarixim 🕒</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Yuborilgan vazifalar holati</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[450px] pr-2 custom-scrollbar">
            {mySubmissions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
                <span className="text-4xl mb-2">🏜️</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Hali vazifa topshirilmagan</p>
              </div>
            ) : (
              mySubmissions.map(sub => (
                <div key={sub.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg border border-slate-100">
                      {sub.image ? <img src={sub.image} className="w-full h-full object-cover rounded-lg" alt="" /> : '📄'}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-none">{sub.taskTitle}</p>
                      <p className="text-[8px] text-slate-400 font-medium mt-1">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${
                      sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                      sub.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {sub.status === 'APPROVED' ? 'Tasdiqlandi' : sub.status === 'REJECTED' ? 'Rad etildi' : 'Kutilmoqda'}
                    </span>
                    <a href={sub.link} target="_blank" rel="noreferrer" className="text-[7px] font-black text-blue-500 uppercase hover:underline">Linkni ko'rish 🔗</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomeworkView;
