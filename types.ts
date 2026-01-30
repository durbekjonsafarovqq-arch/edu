
export type Role = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Secret password for login
  role: Role;
  coins: number;
  avatar: string;
  badges: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  date: string;
  type: 'EARN' | 'SPEND';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: 'EDU' | 'TECH';
}

export interface Task {
  id: string;
  title: string;
  coins: number;
  category: string;
  expiresAt: number;
  link?: string;
}
