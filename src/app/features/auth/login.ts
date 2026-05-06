import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <!-- 🌿 Background Orbs -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-100/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div class="w-full max-w-lg relative z-10 animate-fade-up">
        
        <!-- 💎 Success Alert (Post Reset) -->
        @if (resetSuccess()) {
          <div class="mb-6 p-6 bg-cyan-500 rounded-[32px] shadow-xl shadow-cyan-500/20 text-white flex items-center gap-6 animate-fade-down">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <mat-icon>check_circle</mat-icon>
             </div>
             <div>
                <p class="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">¡Todo listo!</p>
                <p class="text-xs font-bold">Contraseña actualizada. Ya puedes iniciar sesión.</p>
             </div>
          </div>
        }

        <!-- 💎 Glassmorphism Card -->
        <div class="bg-white/70 backdrop-blur-3xl rounded-[48px] p-8 lg:p-12 shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mx-auto mb-6 rotate-6">
              <mat-icon class="scale-110">lock_open</mat-icon>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black text-text-title tracking-tighter uppercase italic mb-1 leading-none">Bienvenido</h1>
            <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-70">Accede a tu formación de élite</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">mail</mat-icon>
                </div>
                <input 
                  formControlName="email"
                  type="email" 
                  class="input-field" 
                  placeholder="tu@nitex.com"
                >
              </div>
              @if (loginForm.get('email')?.touched) {
                @if (loginForm.get('email')?.errors?.['required']) {
                  <p class="input-error-msg">El email es obligatorio</p>
                } @else if (loginForm.get('email')?.errors?.['email']) {
                  <p class="input-error-msg">Email inválido</p>
                }
              }
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center px-4">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                <a routerLink="/auth/forgot-password" class="text-[9px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700">¿Olvidaste?</a>
              </div>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">key</mat-icon>
                </div>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  class="input-field" 
                  placeholder="••••••••"
                >
                <button 
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="w-14 flex items-center justify-center text-slate-300 hover:text-primary-500 transition-colors"
                >
                  <mat-icon class="scale-75">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
                <p class="input-error-msg">La contraseña es obligatoria</p>
              }
            </div>

            @if (errorMsg()) {
              <div class="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-3 animate-fade">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-rose-500 scale-75">error_outline</mat-icon>
                  <p class="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-tight">{{ errorMsg() }}</p>
                </div>
                
                @if (lockoutRemaining() > 0) {
                  <div class="flex items-center gap-3 px-4 py-2 bg-rose-100/50 rounded-xl">
                    <mat-icon class="text-rose-500 scale-50">timer</mat-icon>
                    <p class="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                      Vuelve a intentar en: {{ lockoutRemaining() }}s
                    </p>
                  </div>
                }

                @if (showRecovery()) {
                  <button 
                    type="button"
                    routerLink="/auth/forgot-password"
                    class="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                  >
                    Recuperar Contraseña
                  </button>
                }
              </div>
            }

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full btn-primary py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black shadow-xl shadow-primary-500/20 disabled:opacity-30"
            >
              @if (isLoading()) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              } @else {
                <div class="icon-text">
                   <span>Iniciar sesión</span>
                   <mat-icon class="scale-90">login</mat-icon>
                </div>
              }
            </button>

          </form>

          <div class="mt-8 text-center pt-8 border-t border-slate-200/50">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">¿No tienes cuenta aún?</p>
            <a routerLink="/auth/register" class="text-xs font-black text-primary-600 hover:text-primary-700 tracking-tight transition-colors">Crea tu perfil de estudiante</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = signal(false);
  resetSuccess = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);
  showRecovery = signal(false);
  lockoutRemaining = signal(0);
  private timer: any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['reset'] === 'success') {
        this.resetSuccess.set(true);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');
    this.showRecovery.set(false);

    const { email, password } = this.loginForm.value;
    const response = this.auth.login(email, password);
    
    if (response.success) {
      setTimeout(() => {
        const target = this.auth.isAdmin() ? '/admin' : '/';
        this.router.navigate([target]);
      }, 800);
    } else {
      setTimeout(() => {
        this.errorMsg.set(response.message || 'Error de autenticación');
        if (response.showRecovery) {
          this.showRecovery.set(true);
          this.startLockoutTimer();
        }
        this.isLoading.set(false);
      }, 500);
    }
  }

  private startLockoutTimer() {
    if (this.timer) clearInterval(this.timer);
    
    const update = () => {
      const remaining = this.auth.getLockoutRemaining();
      this.lockoutRemaining.set(remaining);
      if (remaining <= 0) {
        clearInterval(this.timer);
      }
    };

    update();
    this.timer = setInterval(update, 1000);
  }
}
