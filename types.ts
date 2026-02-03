
export type Role = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  coins: number;
  avatar: string;
  badges: string[];
}

export interface HomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  taskId: string;
  taskTitle: string;
  link: string;
  image?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: number;
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
