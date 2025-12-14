import { Routes } from '@angular/router';

/**
 * Server-side Routes Configuration
 */
export const serverRoutes: Routes = [
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

