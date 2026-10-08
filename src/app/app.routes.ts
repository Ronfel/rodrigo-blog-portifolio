import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Blog } from './pages/blog/blog';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Início | Rodrigo' },
  { path: 'sobre', component: About, title: 'Sobre mim | Rodrigo' },
  { path: 'blog', component: Blog, title: 'Blog | Rodrigo' },
  { path: 'contato', component: Contact, title: 'Contato | Rodrigo' },
  { path: '**', redirectTo: '' },
];
