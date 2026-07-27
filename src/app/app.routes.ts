import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./components/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
