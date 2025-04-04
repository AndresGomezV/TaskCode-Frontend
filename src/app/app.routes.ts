import { Routes } from '@angular/router';
import { LoginComponent} from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TasksComponent} from './pages/tasks/tasks.component';
import {UsersComponent} from './pages/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard', canActivate: [authGuard] },
  { path: 'tasks', component: TasksComponent, title: 'Tasks', canActivate: [authGuard], data: { role: 'ADMIN' } },
  { path: 'users', component: UsersComponent, title: 'Users', canActivate: [authGuard], data: { role: 'ADMIN' } },
];
