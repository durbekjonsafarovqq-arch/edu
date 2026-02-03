
import { Reward, Task, User } from './types';

const ONEDAY = 24 * 60 * 60 * 1000;

export const INITIAL_STUDENTS: User[] = [
  { id: '1', name: 'Alisher', email: 'alisher@edu.uz', password: 'student777', role: 'STUDENT', coins: 150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher', badges: [] },
  { id: '2', name: 'Zuxra', email: 'zuhra@edu.uz', password: 'student777', role: 'STUDENT', coins: 620, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zuhra', badges: [] },
  { id: '3', name: 'Javohir', email: 'javohir@edu.uz', password: 'student777', role: 'STUDENT', coins: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Javohir', badges: [] },
];

export const ADMIN_USER: User = { 
  id: 'admin', 
  name: 'Admin', 
  email: 'admin@edu.uz', 
  password: 'admin123', 
  role: 'ADMIN', 
  coins: 0, 
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 
  badges: [] 
};

export const REWARDS: Reward[] = [
  { 
    id: 'r1', 
    title: '5 baho bonus', 
    description: 'Darsdagi faollik uchun sertifikat', 
    cost: 100, 
    icon: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop', 
    category: 'EDU' 
  },
  { 
    id: 'r2', 
    title: 'Vazifadan ozod', 
    description: 'Bitta vazifani topshirmaslik pass-kartasi', 
    cost: 500, 
    icon: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=300&auto=format&fit=crop', 
    category: 'EDU' 
  },
  { 
    id: 'r3', 
    title: 'IT Sticker Pack', 
    description: 'Noutbuk uchun Developer stikerlari', 
    cost: 50, 
    icon: 'https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?q=80&w=300&auto=format&fit=crop', 
    category: 'TECH' 
  },
  { 
    id: 'r5', 
    title: 'Gaming Mouse', 
    description: 'RGB professional sichqoncha', 
    cost: 1200, 
    icon: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop', 
    category: 'TECH' 
  },
  { 
    id: 'r6', 
    title: 'IT Headphones', 
    description: 'Shovqin qaytaruvchi quloqchin', 
    cost: 2500, 
    icon: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=300&auto=format&fit=crop', 
    category: 'TECH' 
  },
  { 
    id: 'r7', 
    title: 'Mechanical Keyboard', 
    description: 'RGB mexanik klaviatura', 
    cost: 4000, 
    icon: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=300&auto=format&fit=crop', 
    category: 'TECH' 
  },
  { 
    id: 'r8', 
    title: 'MacBook Air M3', 
    description: 'Professional o`quvchilar uchun super mukofot', 
    cost: 50000, 
    icon: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop', 
    category: 'TECH' 
  },
];

export const TASKS: Task[] = [
  { id: 't1', title: 'Uyga vazifani vaqtida topshirish', coins: 20, category: 'O`qish', expiresAt: Date.now() + ONEDAY, link: 'https://google.com' },
  { id: 't2', title: 'Darsda faol qatnashish', coins: 10, category: 'Faollik', expiresAt: Date.now() + ONEDAY, link: 'https://youtube.com' },
  { id: 't3', title: 'Jamoaviy loyihada qatnashish', coins: 50, category: 'Loyiha', expiresAt: Date.now() + ONEDAY, link: 'https://github.com' },
  { id: 't4', title: 'Kod yozish musobaqasi g`olibi', coins: 500, category: 'IT Challenge', expiresAt: Date.now() + ONEDAY, link: 'https://leetcode.com' },
];
