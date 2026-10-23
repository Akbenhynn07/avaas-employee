import { CompanyUser } from '../types';

export const AUTHORIZED_USERS: CompanyUser[] = [
  {
    email: 'ceo@avaas.me',
    role: 'CEO',
    title: 'Chief Executive Officer',
    department: 'Executive Leadership',
    avatarColor: 'from-amber-500 to-orange-600',
    initials: 'CE',
    isCeo: true,
  },
  {
    email: 'cto@avaas.me',
    role: 'CTO',
    title: 'Chief Technology Officer',
    department: 'Engineering & Tech',
    avatarColor: 'from-blue-500 to-cyan-500',
    initials: 'CT',
  },
  {
    email: 'coo@avaas.me',
    role: 'COO',
    title: 'Chief Operating Officer',
    department: 'Operations & Strategy',
    avatarColor: 'from-emerald-500 to-teal-600',
    initials: 'CO',
  },
  {
    email: 'cfo@avaas.me',
    role: 'CFO',
    title: 'Chief Financial Officer',
    department: 'Finance & Planning',
    avatarColor: 'from-violet-500 to-purple-600',
    initials: 'CF',
  },
  {
    email: 'cmo@avaas.me',
    role: 'CMO',
    title: 'Chief Marketing Officer',
    department: 'Growth & Brand',
    avatarColor: 'from-pink-500 to-rose-600',
    initials: 'CM',
  },
  {
    email: 'cpro@avaas.me',
    role: 'CPRO',
    title: 'Chief Public Relations Officer / Product',
    department: 'PR & Product Strategy',
    avatarColor: 'from-indigo-500 to-blue-600',
    initials: 'CP',
  },
];

export const getAuthorizedUser = (email: string): CompanyUser | undefined => {
  return AUTHORIZED_USERS.find(
    (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
  );
};
