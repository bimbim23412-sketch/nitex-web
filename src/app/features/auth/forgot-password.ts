import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans">
      <!-- 🌿 Elite Background Orbs -->
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div class="w-full max-w-lg relative z-10">
        
        <!-- 📧 Mock Email Notification (For Demo Purposes) -->
        @if (showEmailMock()) {
          <div class="absolute -top-32 left-0 w-full animate-fade-down z-50">
             <div class="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                <div class="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white">
                   <mat-icon>mail</mat-icon>
                </div>
                <div class="flex-grow">
                   <p class="text-[10px] font-black text-cyan-400 uppercase tracking-widest leading-none mb-1">NITEX Academy</p>
                   <p class="text-xs font-bold text-white/90">Tu código de recuperación es: <span class="text-cyan-400 text-lg ml-2">{{ lastGeneratedCode() }}</span></p>
                </div>
                <button (click)="showEmailMock.set(false)" class="text-white/20 hover:text-white">
                   <mat-icon>close</mat-icon>
                </button>
             </div>
          </div>
        }

        <div class="bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-8 lg:p-14 border border-white/5 shadow-2xl relative overflow-hidden">
          
          <div class="text-center mb-10">
            <div class="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-cyan-500/20 mx-auto mb-8 rotate-3">
              <mat-icon class="scale-125">security</mat-icon>
            </div>
            <h1 class="text-4xl font-black text-white tracking-tighter uppercase italic mb-2 leading-none">Seguridad</h1>
            <p class="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Recuperación de acceso NITEX</p>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center gap-2 mb-12 px-6">
             @for (s of [1, 2, 3]; track s) {
                <div class="flex-grow h-1.5 rounded-full transition-all duration-500"
                   [class]="step() === s ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 
                            step() > s ? 'bg-cyan-500/30' : 'bg-white/5'">
                </div>
             }
          </div>

          <!-- Step 1: Email Input -->
          @if (step() === 1) {
            <form [formGroup]="emailForm" (ngSubmit)="handleSendCode()" class="space-y-8 animate-fade-right">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Correo Electrónico</label>
                <div class="relative group">
                  <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">alternate_email</mat-icon>
                  <input formControlName="email" type="email" class="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10" placeholder="ejemplo@nitex.com">
                </div>
              </div>
              <button type="submit" [disabled]="emailForm.invalid || isLoading()" class="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-30">
                 {{ isLoading() ? 'Validando...' : 'Enviar Código de Seguridad' }}
              </button>
            </form>
          }

          <!-- Step 2: Code Verification -->
          @if (step() === 2) {
            <div class="space-y-10 animate-fade-right">
               <div class="text-center space-y-4">
                  <p class="text-white/60 text-sm font-medium italic leading-relaxed">
                    Hemos enviado un código de 6 dígitos a <br>
                    <span class="text-cyan-400 font-black not-italic">{{ emailForm.value.email }}</span>
                  </p>
               </div>

               <div class="space-y-4">
                  <div class="flex justify-center gap-3">
                     <input #c1 (keyup)="onKeyUp($event, c2, null)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                     <input #c2 (keyup)="onKeyUp($event, c3, c1)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                     <input #c3 (keyup)="onKeyUp($event, c4, c2)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                     <input #c4 (keyup)="onKeyUp($event, c5, c3)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                     <input #c5 (keyup)="onKeyUp($event, c6, c4)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                     <input #c6 (keyup)="onKeyUp($event, null, c5)" type="text" maxlength="1" class="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all">
                  </div>
               </div>

               <button (click)="handleVerifyCode([c1, c2, c3, c4, c5, c6])" [disabled]="isLoading()" class="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-30">
                  {{ isLoading() ? 'Verificando...' : 'Confirmar Código' }}
               </button>

               <div class="text-center space-y-4">
                  @if (resendTimer() > 0) {
                     <p class="text-[10px] font-black text-white/20 uppercase tracking-widest">Reenviar código en: <span class="text-cyan-500">{{ resendTimer() }}s</span></p>
                  } @else {
                     <button (click)="handleResend()" class="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-300 transition-colors underline underline-offset-8">Solicitar nuevo código</button>
                  }
               </div>
            </div>
          }

          <!-- Step 3: New Password -->
          @if (step() === 3) {
            <form [formGroup]="passForm" (ngSubmit)="handleResetPassword()" class="space-y-8 animate-fade-right">
              <div class="space-y-6">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Nueva Contraseña</label>
                  <div class="relative group">
                    <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">lock</mat-icon>
                    <input formControlName="password" type="password" class="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10" placeholder="Mínimo 8 caracteres">
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
                  <div class="relative group">
                    <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors">verified_user</mat-icon>
                    <input formControlName="confirmPassword" type="password" class="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 pl-16 pr-6 text-white text-sm font-bold outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10" placeholder="Repite la contraseña">
                  </div>
                </div>
              </div>
              <button type="submit" [disabled]="passForm.invalid || isLoading()" class="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-30">
                 {{ isLoading() ? 'Guardando...' : 'Finalizar y Entrar' }}
              </button>
            </form>
          }

          @if (errorMsg()) {
            <div class="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 animate-shake">
              <mat-icon class="text-rose-500">warning</mat-icon>
              <p class="text-[11px] font-bold text-rose-200 uppercase tracking-widest leading-tight">{{ errorMsg() }}</p>
            </div>
          }

          <div class="mt-12 text-center pt-10 border-t border-white/5">
            <a routerLink="/auth/login" class="text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-3">
               <mat-icon class="scale-75">west</mat-icon> Cancelar y volver
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class ForgotPassword implements OnDestroy {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal(1);
  isLoading = signal(false);
  errorMsg = signal('');
  resendTimer = signal(0);
  private timerInterval: any;

  // For Demo
  showEmailMock = signal(false);
  lastGeneratedCode = signal('');

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  passForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: (g: FormGroup) => g.get('password')?.value === g.get('confirmPassword')?.value ? null : { 'mismatch': true } });

  ngOnDestroy() {
    this.stopTimer();
  }

  handleSendCode() {
    if (this.emailForm.invalid) return;
    this.isLoading.set(true);
    this.errorMsg.set('');

    const res = this.auth.sendRecoveryCode(this.emailForm.value.email);
    setTimeout(() => {
      this.isLoading.set(false);
      if (res.success) {
        this.step.set(2);
        this.startResendTimer();
        this.triggerEmailMock();
      } else {
        this.errorMsg.set(res.message);
      }
    }, 1500);
  }

  handleResend() {
    this.isLoading.set(true);
    const res = this.auth.sendRecoveryCode(this.emailForm.value.email);
    setTimeout(() => {
      this.isLoading.set(false);
      this.startResendTimer();
      this.triggerEmailMock();
    }, 1000);
  }

  private triggerEmailMock() {
    // En una app real esto no existiría, es solo para el demo
    this.lastGeneratedCode.set((this.auth as any).recoveryCode());
    this.showEmailMock.set(true);
    setTimeout(() => this.showEmailMock.set(false), 8000);
  }

  handleVerifyCode(inputs: HTMLInputElement[]) {
    const code = inputs.map(i => i.value).join('');
    if (code.length < 6) return;
    
    this.isLoading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      this.isLoading.set(false);
      const res = this.auth.verifyRecoveryCode(code);
      if (res.success) {
        this.step.set(3);
      } else {
        this.errorMsg.set(res.message || 'Código inválido');
        inputs.forEach(i => i.value = '');
        inputs[0].focus();
      }
    }, 1500);
  }

  handleResetPassword() {
    if (this.passForm.invalid) return;
    this.isLoading.set(true);
    
    setTimeout(() => {
      if (this.auth.resetPassword(this.passForm.value.password)) {
        this.router.navigate(['/auth/login'], { queryParams: { reset: 'success' } });
      }
      this.isLoading.set(false);
    }, 2000);
  }

  onKeyUp(event: any, next: HTMLInputElement | null, prev: HTMLInputElement | null) {
    if (event.key >= 0 && event.key <= 9) {
      if (next) next.focus();
    } else if (event.key === 'Backspace') {
      if (prev) prev.focus();
    }
  }

  private startResendTimer() {
    this.resendTimer.set(60);
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.resendTimer.update(t => t > 0 ? t - 1 : 0);
      if (this.resendTimer() === 0) this.stopTimer();
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
