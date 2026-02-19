import { Routes } from '@angular/router';
import { NextLogin } from './components/next-login/next-login';
import { SignPag } from './components/sign-pag/sign-pag';
import { RegisterPag } from './components/register-pag/register-pag';
import { Termos } from './modals/termos/termos';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { ProjectList } from './components/project-list/project-list';
import { Dashboard } from './components/dashboard/dashboard';
import { Calendar } from './components/calendar/calendar';
import { Documents } from './components/documents/documents';
import { Team } from './components/team/team';
import { Reports } from './components/reports/reports';


export const routes: Routes = [
    {path: '', redirectTo: 'sign-pag', pathMatch: 'full'},
    
    {
      path: 'next-login', 
      component: NextLogin,
      canActivate: [authGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
        { path: 'dashboard', component: Dashboard },

        { path: 'projects', component: ProjectList },
        { path: 'calendar', component: Calendar },
        { path: 'documents', component: Documents },
        { path: 'team', component: Team },
        { path: 'reports', component: Reports },
      ]
    },
    {path: 'sign-pag', component: SignPag, canActivate: [publicGuard] },
    {path: 'register-pag', component: RegisterPag, canActivate: [publicGuard] },
    {path: 'termos', component: Termos},
];
