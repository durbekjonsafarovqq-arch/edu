
import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  students: User[];
  addStudent: (name: string, email: string) => void;
  updateStudent: (id: string, data: Partial<User>) => void;
  deleteStudent?: (id: string) => void;
}

const StudentsView: React.FC<Props> = ({ students, addStudent, updateStudent, deleteStudent }) => {
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
    if (name.trim() && email.trim()) {
      if (editingStudent) {
        updateStudent(editingStudent.id, { name, email, coins });
        setEditingStudent(null);
      } else {
        addStudent(name, email);
        setShowAdd(false);
      }
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">O'quvchilar</h2>
          <p className="text-slate-400 text-[11px] font-medium uppercase tracking-widest mt-1">Akademiya a'zolarini boshqaring</p>
        </div>
        <button 
          onClick={() => { setShowAdd(true); setEditingStudent(null); setName(''); setEmail(''); }}
          className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest text-[9px]"
        >
          <span>➕</span> Yangi o'quvchi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <img src={s.avatar} className="w-14 h-14 rounded-xl bg-blue-50 border border-slate-100" alt="" />
              <div className="overflow-hidden">
                <h3 className="font-black text-[13px] text-slate-800 truncate">{s.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 truncate">{s.email}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Balans</span>
                <span className="font-black text-blue-600 text-base">🪙 {s.coins}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(s)}
                  className="px-3 py-1.5 text-[8px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all uppercase tracking-widest"
                >
                  Edit
                </button>
                {deleteStudent && (
                  <button 
                    onClick={() => deleteStudent(s.id)}
                    className="px-3 py-1.5 text-[8px] font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all uppercase tracking-widest"
                  >
                    Del
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editingStudent) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-800 mb-6">{editingStudent ? 'Tahrirlash' : 'Yangi O\'quvchi'}</h3>
            <div className="space-y-4 mb-8">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Ism Familiya</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Alisher Navoiy" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 font-bold text-slate-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@edu.uz" className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 font-bold text-slate-700 text-xs" />
              </div>
              {editingStudent && (
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Balans</label>
                  <input type="number" value={coins} onChange={e => setCoins(parseInt(e.target.value))} className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 font-bold text-slate-700 text-xs" />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAdd(false); setEditingStudent(null); }} className="flex-1 py-3 font-black text-slate-400 uppercase tracking-widest text-[9px]">Bekor qilish</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg uppercase tracking-widest text-[9px]">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
