import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { CourseList } from './features/courses/course-list';
import { CourseDetail } from './features/courses/course-detail';
import { LearningClassroom } from './features/courses/learning-classroom';
import { Login } from './features/auth/login';
import { Register } from './features/auth/register';
import { ForgotPassword } from './features/auth/forgot-password';
import { ProfileDashboard } from './features/profile/profile-dashboard';
import { AdminPanel } from './features/admin/admin-panel';
import { About } from './features/about/about';

import { FinalExam } from './features/courses/final-exam';
import { CertificateViewer } from './features/profile/certificate-viewer';

import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio' },
  { path: 'courses', component: CourseList, title: 'Cursos' },
  { path: 'courses/:id', component: CourseDetail, title: 'Detalle del Curso' },
  { path: 'learning/:id', component: LearningClassroom, title: 'Aula Virtual', canActivate: [authGuard] },
  { path: 'exam/:id', component: FinalExam, title: 'Examen Final', canActivate: [authGuard] },
  { path: 'about', component: About, title: 'Nosotros' },
  { path: 'auth/login', component: Login, title: 'Iniciar sesión' },
  { path: 'auth/register', component: Register, title: 'Registro' },
  { path: 'auth/forgot-password', component: ForgotPassword, title: 'Recuperar Contraseña' },
  { path: 'profile', component: ProfileDashboard, title: 'Mi Perfil', canActivate: [authGuard] },
  { path: 'certificates/:id', component: CertificateViewer, title: 'Certificado', canActivate: [authGuard] },
  { path: 'admin', component: AdminPanel, title: 'Panel de Control', canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
