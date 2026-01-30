
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { User, Role, Task, Reward } from './types';
import { INITIAL_STUDENTS, TASKS, REWARDS, ADMIN_USER } from './constants';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import StudentsView from './views/StudentsView';
import TasksView from './views/TasksView';
import ShopView from './views/ShopView';
import LeaderboardView from './views/LeaderboardView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>(INITIAL_STUDENTS);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(TASKS);
  const [currentRewards, setCurrentRewards] = useState<Reward[]>(REWARDS);
  const [now, setNow] = useState(Date.now());
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('educoin_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === 'STUDENT') {
        const latest = students.find(s => s.id === parsed.id);
        if (latest) setCurrentUser(latest);
        else setCurrentUser(parsed);
      } else {
        setCurrentUser(parsed);
      }
    }
  }, [students]);

  const activeTasks = currentTasks.filter(task => task.expiresAt > now);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const input = loginInput.toLowerCase().trim();

    // 1. Admin Login check
    if (input === 'admin' && loginPassword === ADMIN_USER.password) {
      setCurrentUser(ADMIN_USER);
      localStorage.setItem('educoin_user', JSON.stringify(ADMIN_USER));
      return;
    }

    // 2. Student Login check
    if (input === 'student' && loginPassword === 'student777') {
      // Login as the first student by default for simplicity
      const student = students[0]; 
      setCurrentUser(student);
      localStorage.setItem('educoin_user', JSON.stringify(student));
      return;
    }

    // 3. Fallback: Check Students by Name or Email (just in case)
    const student = students.find(s => 
      (s.email.toLowerCase() === input || s.name.toLowerCase() === input) && 
      s.password === loginPassword
    );

    if (student) {
      setCurrentUser(student);
      localStorage.setItem('educoin_user', JSON.stringify(student));
    } else {
      setLoginError('Login yoki parol xato! Admin uchun "admin", o\'quvchi uchun "student" deb yozing.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('educoin_user');
    setLoginInput('');
    setLoginPassword('');
  };

  const updateStudentCoins = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, coins: Math.max(0, s.coins + amount) } : s));
  };

  const updateStudentInfo = (id: string, updatedData: Partial<User>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const addStudent = (name: string, email: string) => {
    const newStudent: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: 'student777',
      role: 'STUDENT',
      coins: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      badges: []
    };
    setStudents([...students, newStudent]);
  };

  const addTask = (title: string, coins: number, category: string, link?: string) => {
    const ONEDAY = 24 * 60 * 60 * 1000;
    setCurrentTasks([...currentTasks, { 
      id: Date.now().toString(), 
      title, 
      coins, 
      category, 
      expiresAt: Date.now() + ONEDAY,
      link: link || '#'
    }]);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b1e] p-6 font-sans text-white">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-2xl p-12 max-w-md w-full border border-white/10 relative overflow-hidden group">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-[80px] group-hover:bg-cyan-600/30 transition-all duration-700"></div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(37,99,235,0.4)] transform hover:rotate-6 transition-transform">
              <span className="text-5xl">💎</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">EduCoin</h1>
            <p className="text-blue-400 font-bold uppercase tracking-[5px] text-[10px]">Bilimlar Akademiyasi</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Login</label>
              <input 
                type="text" 
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="admin yoki student" 
                className="w-full px-7 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 ring-blue-500 outline-none font-bold text-white placeholder:text-white/20 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Parol</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-7 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-2 ring-blue-500 outline-none font-bold text-white placeholder:text-white/20 transition-all" 
              />
            </div>
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-2xl">
                <p className="text-red-400 text-xs font-bold text-center px-4">{loginError}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-xs mt-4"
            >
               Kirish
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tezkor Ma'lumotlar:</p>
              <div className="flex flex-col gap-2">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[11px] text-slate-300">Domla: <span className="text-blue-400 font-black">admin</span> / <span className="text-blue-400">admin123</span></p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[11px] text-slate-300">O'quvchi: <span className="text-cyan-400 font-black">student</span> / <span className="text-cyan-400">student777</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
        <Sidebar user={currentUser} handleLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-4 md:p-10 bg-slate-50/50">
          <Routes>
            <Route path="/" element={
              currentUser.role === 'ADMIN' 
              ? <TeacherDashboard students={students} updateCoins={updateStudentCoins} tasks={activeTasks} /> 
              : <StudentDashboard user={currentUser} students={students} updateCoins={updateStudentCoins} tasks={activeTasks} />
            } />
            
            {currentUser.role === 'ADMIN' && (
              <>
                <Route path="/students" element={<StudentsView students={students} addStudent={addStudent} updateStudent={updateStudentInfo} />} />
                <Route path="/tasks" element={<TasksView tasks={activeTasks} addTask={addTask} />} />
              </>
            )}

            {currentUser.role === 'STUDENT' && (
              <>
                <Route path="/shop" element={<ShopView user={currentUser} rewards={currentRewards} updateCoins={updateStudentCoins} />} />
                <Route path="/leaderboard" element={<LeaderboardView students={students} currentUser={currentUser} />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const Sidebar = ({ user, handleLogout }: { user: User, handleLogout: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const NavLink = ({ to, icon, children }: { to: string, icon: string, children: React.ReactNode }) => (
    <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-[28px] transition-all duration-300 group ${isActive(to) ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
      <span className="text-2xl group-hover:rotate-12 transition-transform">{icon}</span>
      <span className="font-black text-[13px] uppercase tracking-widest">{children}</span>
    </Link>
  );

  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col sticky top-0 md:h-screen z-40 shadow-sm">
      <div className="p-10 flex items-center gap-5">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-200">
          <span className="text-3xl">💎</span>
        </div>
        <div>
          <h1 className="font-black text-2xl text-slate-800 tracking-tighter leading-none">EduCoin</h1>
          <span className="text-[10px] uppercase font-black text-blue-500 tracking-[3px]">IT Platform</span>
        </div>
      </div>
      
      <div className="flex-1 px-8 space-y-10 overflow-y-auto">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] mb-6 px-4">Menu</p>
          <NavLink to="/" icon="📊">Bosh Sahifa</NavLink>
        </div>

        {user.role === 'ADMIN' ? (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] mb-6 px-4">Boshqaruv</p>
            <NavLink to="/students" icon="👥">O'quvchilar</NavLink>
            <NavLink to="/tasks" icon="📝">Vazifalar</NavLink>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px] mb-6 px-4">Xizmatlar</p>
            <NavLink to="/shop" icon="🛒">Do'kon</NavLink>
            <NavLink to="/leaderboard" icon="🏆">Reyting</NavLink>
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="bg-slate-50 p-6 rounded-[32px] mb-6 flex items-center gap-5 border border-slate-100 shadow-sm">
          <div className="relative">
            <img src={user.avatar} className="w-14 h-14 rounded-2xl bg-white border border-slate-200" alt="" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-slate-800 text-sm truncate">{user.name}</p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{user.role === 'ADMIN' ? 'Ustoz' : 'O\'quvchi'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-5 text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-[24px] transition-all uppercase tracking-widest">
          🚪 Chiqish
        </button>
      </div>
    </aside>
  );
};

export default App;
