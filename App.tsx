
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { User, Role, Task, Reward, HomeworkSubmission } from './types';
import { INITIAL_STUDENTS, TASKS, REWARDS, ADMIN_USER } from './constants';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import StudentsView from './views/StudentsView';
import TasksView from './views/TasksView';
import ShopView from './views/ShopView';
import LeaderboardView from './views/LeaderboardView';
import HomeworkView from './views/HomeworkView';

const NavLink: React.FC<{ to: string; icon: string; children: React.ReactNode }> = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 group ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}>
      <span className="text-lg group-hover:rotate-6 transition-transform">{icon}</span>
      <span className="font-bold text-[10px] uppercase tracking-wider">{children}</span>
    </Link>
  );
};

const Sidebar: React.FC<{ user: User; handleLogout: () => void }> = ({ user, handleLogout }) => {
  return (
    <aside className="w-full md:w-[220px] bg-white border-r border-slate-100 flex flex-col sticky top-0 md:h-screen z-40">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center text-lg shadow-lg">💎</div>
        <div>
          <h1 className="font-black text-md text-slate-800 tracking-tighter leading-none">EduCoin</h1>
          <span className="text-[6px] uppercase font-black text-blue-500 tracking-[1.5px]">IT ACADEMY</span>
        </div>
      </div>
      
      <div className="flex-1 px-3 space-y-3 overflow-y-auto mt-2">
        <div className="space-y-1">
          <p className="text-[6px] font-black text-slate-300 uppercase tracking-[2px] mb-2 px-3">Menu</p>
          <NavLink to="/" icon="📊">Asosiy</NavLink>
          {user.role === 'STUDENT' && (
            <NavLink to="/submit-homework" icon="📝">Vazifa Topshirish</NavLink>
          )}
        </div>

        {user.role === 'ADMIN' ? (
          <div className="space-y-1">
            <p className="text-[6px] font-black text-slate-300 uppercase tracking-[2px] mb-2 px-3">Boshqaruv</p>
            <NavLink to="/students" icon="👥">O'quvchilar</NavLink>
            <NavLink to="/tasks" icon="⚙️">Vazifalar</NavLink>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[6px] font-black text-slate-300 uppercase tracking-[2px] mb-2 px-3">Xizmatlar</p>
            <NavLink to="/shop" icon="🛒">Do'kon</NavLink>
            <NavLink to="/leaderboard" icon="🏆">Reyting</NavLink>
          </div>
        )}
      </div>

      <div className="p-3 mt-auto border-t border-slate-50">
        <div className="bg-slate-50 p-2.5 rounded-xl mb-3 flex items-center gap-2 border border-slate-100 overflow-hidden">
          <img src={user.avatar} className="w-7 h-7 rounded-lg bg-white border border-slate-200" alt="" />
          <div className="overflow-hidden">
            <p className="font-bold text-slate-800 text-[10px] truncate">{user.name}</p>
            <p className="text-[6px] font-black text-blue-500 uppercase tracking-widest">{user.role === 'ADMIN' ? 'Ustoz' : 'O\'quvchi'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-[8px] font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all uppercase tracking-widest">
          🚪 Chiqish
        </button>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [students, setStudents] = useState<User[]>(() => {
    const saved = localStorage.getItem('edu_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentTasks, setCurrentTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('edu_tasks');
    return saved ? JSON.parse(saved) : TASKS;
  });

  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => {
    const saved = localStorage.getItem('edu_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [now, setNow] = useState(Date.now());
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('edu_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edu_tasks', JSON.stringify(currentTasks));
  }, [currentTasks]);

  useEffect(() => {
    localStorage.setItem('edu_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('educoin_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const latest = parsed.role === 'ADMIN' ? ADMIN_USER : students.find(s => s.id === parsed.id);
        if (latest) setCurrentUser(latest);
      } catch (e) {
        localStorage.removeItem('educoin_user');
      }
    }
  }, [students]);

  const activeTasks = currentTasks.filter(task => task.expiresAt > now);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const input = loginInput.toLowerCase().trim();

    if (input === 'admin' && loginPassword === ADMIN_USER.password) {
      setCurrentUser(ADMIN_USER);
      localStorage.setItem('educoin_user', JSON.stringify(ADMIN_USER));
      return;
    }

    if (input === 'student' && loginPassword === 'student777') {
      const student = students[0];
      setCurrentUser(student);
      localStorage.setItem('educoin_user', JSON.stringify(student));
      return;
    }

    const student = students.find(s => 
      (s.email.toLowerCase() === input || s.name.toLowerCase() === input) && 
      s.password === loginPassword
    );

    if (student) {
      setCurrentUser(student);
      localStorage.setItem('educoin_user', JSON.stringify(student));
    } else {
      setLoginError('Login yoki parol xato! Admin: admin/admin123, O\'quvchi: student/student777');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('educoin_user');
  };

  // State Management Functions
  const updateStudentCoins = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, coins: Math.max(0, s.coins + amount) } : s));
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
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, data: Partial<User>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStudent = (id: string) => {
    if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const addTask = (title: string, coins: number, category: string, link?: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      coins,
      category,
      link,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    setCurrentTasks(prev => [...prev, newTask]);
  };

  const addHomeworkSubmission = (sub: HomeworkSubmission) => {
    setSubmissions(prev => [sub, ...prev]);
  };

  const approveSubmission = (subId: string) => {
    const sub = submissions.find(s => s.id === subId);
    if (sub && sub.status === 'PENDING') {
      const task = currentTasks.find(t => t.id === sub.taskId);
      if (task) {
        updateStudentCoins(sub.studentId, task.coins);
      }
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'APPROVED' } : s));
    }
  };

  const rejectSubmission = (subId: string) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'REJECTED' } : s));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b1e] p-4 font-sans text-white">
        <div className="bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl p-8 max-w-sm w-full border border-white/10 relative overflow-hidden">
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl text-2xl transform hover:rotate-12 transition-transform">💎</div>
            <h1 className="text-2xl font-black text-white tracking-tighter mb-1">EduCoin</h1>
            <p className="text-blue-400 font-bold uppercase tracking-[4px] text-[7px] opacity-80">Virtual IT Academy</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <input type="text" required value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="Login (admin / student)" className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-white text-xs" />
            <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Parol" className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-white text-xs" />
            {loginError && <p className="text-red-400 text-[9px] font-bold text-center bg-red-500/10 py-2 rounded-xl">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] mt-4 active:scale-95">Kirish 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
        <Sidebar user={currentUser} handleLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-3 md:p-5 bg-slate-50/50">
          <Routes>
            <Route path="/" element={
              currentUser.role === 'ADMIN' 
              ? <TeacherDashboard students={students} updateCoins={updateStudentCoins} tasks={activeTasks} submissions={submissions} approveSubmission={approveSubmission} rejectSubmission={rejectSubmission} /> 
              : <StudentDashboard user={currentUser} students={students} updateCoins={updateStudentCoins} tasks={activeTasks} />
            } />
            {currentUser.role === 'STUDENT' && (
              <>
                <Route path="/submit-homework" element={<HomeworkView user={currentUser} tasks={activeTasks} submissions={submissions} addSubmission={addHomeworkSubmission} />} />
                <Route path="/shop" element={<ShopView user={currentUser} rewards={REWARDS} updateCoins={updateStudentCoins} />} />
                <Route path="/leaderboard" element={<LeaderboardView students={students} currentUser={currentUser} />} />
              </>
            )}
            {currentUser.role === 'ADMIN' && (
              <>
                <Route path="/students" element={<StudentsView students={students} addStudent={addStudent} updateStudent={updateStudent} deleteStudent={deleteStudent} />} />
                <Route path="/tasks" element={<TasksView tasks={activeTasks} addTask={addTask} />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
