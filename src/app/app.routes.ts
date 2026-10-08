import { Routes } from '@angular/router';
import { adminRoutes } from './admin.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
    title: 'Início | Rodrigo',
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/about/about').then((module) => module.About),
    title: 'Sobre mim | Rodrigo',
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then((module) => module.Blog),
    title: 'Blog | Rodrigo',
  },
  {
    path: 'contato',
    loadComponent: () => import('./pages/contact/contact').then((module) => module.Contact),
    title: 'Contato | Rodrigo',
  },
  ...adminRoutes,
  { path: '**', redirectTo: '' },
];
