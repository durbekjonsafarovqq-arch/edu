
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  students: User[];
  addStudent: (name: string, email: string) => void;
  updateStudent: (id: string, data: Partial<User>) => void;
}

const StudentsView: React.FC<Props> = ({ students, addStudent, updateStudent }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coins, setCoins] = useState(0);

  const startEdit = (s: User) => {
    setEditingStudent(s);
    setName(s.name);
    setEmail(s.email);
    setCoins(s.coins);
  };

  const handleSave = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, { name, email, coins });
      setEditingStudent(null);
    } else {
      addStudent(name, email);
      setShowAdd(false);
    }
    setName('');
    setEmail('');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">O'quvchilar Boshqaruvi</h2>
          <p className="text-slate-400 font-medium">Akademiya a'zolarini tahrirlash va qo'shish</p>
        </div>
        <button 
          onClick={() => { setShowAdd(true); setEditingStudent(null); setName(''); setEmail(''); }}
          className="px-8 py-4 bg-blue-600 text-white font-black rounded-[24px] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
        >
          <span>➕</span> Yangi o'quvchi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.map(s => (
          <div key={s.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img src={s.avatar} className="w-20 h-20 rounded-[28px] bg-blue-50 border-2 border-blue-100 group-hover:scale-105 transition-transform" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">IT</div>
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-800">{s.name}</h3>
                <p className="text-xs font-bold text-slate-400">{s.email}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Balans</span>
                <span className="font-black text-blue-600 text-xl">🪙 {s.coins}</span>
              </div>
              <button 
                onClick={() => startEdit(s)}
                className="px-5 py-2.5 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all uppercase tracking-widest"
              >
                Tahrirlash
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
          </div>
        ))}
      </div>

      {(showAdd || editingStudent) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <h3 className="text-3xl font-black text-slate-800 mb-2">{editingStudent ? 'Tahrirlash' : 'Yangi O\'quvchi'}</h3>
            <p className="text-slate-400 font-medium mb-10">Ma'lumotlarni kiriting</p>
            <div className="space-y-5 mb-10">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ism Familiya</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Alisher Navoiy" className="w-full px-8 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-4 ring-blue-100 font-bold text-slate-700" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@edu.uz" className="w-full px-8 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-4 ring-blue-100 font-bold text-slate-700" />
              </div>
              {editingStudent && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">EduCoin Balansi</label>
                  <input type="number" value={coins} onChange={e => setCoins(parseInt(e.target.value))} className="w-full px-8 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-4 ring-blue-100 font-bold text-slate-700" />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowAdd(false); setEditingStudent(null); }} className="flex-1 py-5 font-black text-slate-400 uppercase tracking-widest text-xs">Bekor qilish</button>
              <button 
                onClick={handleSave}
                className="flex-1 py-5 bg-blue-600 text-white font-black rounded-[24px] shadow-2xl shadow-blue-100 uppercase tracking-widest text-xs"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
