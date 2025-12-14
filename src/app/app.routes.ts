import { Routes } from '@angular/router';

/**
 * Application Routes
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full'
  },
  {
    path: 'todos',
    loadComponent: () => import('./todo/todo').then(m => m.TodoComponent)
  }
];

