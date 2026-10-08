import { Routes } from '@angular/router';
import { adminGuard } from './admin/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/admin-login').then((module) => module.AdminLogin),
    title: 'Acesso administrativo | Rodrigo',
  },
  {
    path: 'admin',
    canActivateChild: [adminGuard],
    loadComponent: () => import('./admin/admin-shell').then((module) => module.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'projetos' },
      {
        path: 'projetos',
        loadComponent: () =>
          import('./admin/projects/admin-project-form').then((module) => module.AdminProjectForm),
        title: 'Cadastrar projeto | Rodrigo',
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./admin/posts/admin-post-form').then((module) => module.AdminPostForm),
        title: 'Cadastrar post | Rodrigo',
      },
    ],
  },
];
