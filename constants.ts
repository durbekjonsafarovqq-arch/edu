
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
  { id: 'r1', title: '5 baho bonus', description: 'Darsdagi faollik uchun qo`shimcha baho', cost: 100, icon: '⭐', category: 'EDU' },
  { id: 'r2', title: 'Uyga vazifadan ozod', description: 'Bitta ixtiyoriy uyga vazifani topshirmaslik huquqi', cost: 500, icon: '🏠', category: 'EDU' },
  { id: 'r3', title: 'Sticker Pack', description: 'Noutbuk uchun maxsus IT stikerlar to`plami', cost: 50, icon: '🎨', category: 'TECH' },
  { id: 'r5', title: 'RGB Gaming Mouse', description: 'Dasturlashda tezlik va qulaylik uchun', cost: 1200, icon: '🖱️', category: 'TECH' },
  { id: 'r6', title: 'IT Headphones', description: 'Deep Work uchun shovqin qaytaruvchi quloqchin', cost: 2500, icon: '🎧', category: 'TECH' },
  { id: 'r7', title: 'Mechanical Keyboard', description: 'Kod yozishda o`zgacha zavq beruvchi klaviatura', cost: 4000, icon: '⌨️', category: 'TECH' },
  { id: 'r8', title: 'MacBook Air M3', description: 'Eng kuchli o`quvchilar uchun maxsus mukofot', cost: 50000, icon: '💻', category: 'TECH' },
];

export const TASKS: Task[] = [
  { id: 't1', title: 'Uyga vazifani vaqtida topshirish', coins: 20, category: 'O`qish', expiresAt: Date.now() + ONEDAY, link: 'https://google.com' },
  { id: 't2', title: 'Darsda faol qatnashish', coins: 10, category: 'Faollik', expiresAt: Date.now() + ONEDAY, link: 'https://youtube.com' },
  { id: 't3', title: 'Jamoaviy loyihada qatnashish', coins: 50, category: 'Loyiha', expiresAt: Date.now() + ONEDAY, link: 'https://github.com' },
  { id: 't4', title: 'Kod yozish musobaqasi g`olibi', coins: 500, category: 'IT Challenge', expiresAt: Date.now() + ONEDAY, link: 'https://leetcode.com' },
];
