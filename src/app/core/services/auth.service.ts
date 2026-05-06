import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  
  // Security state
  private failedAttempts = signal(0);
  private lockoutTime = signal<number | null>(null);
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 60 * 1000; // 1 minute

  // Recovery state (simulated)
  private recoveryCode = signal<string | null>(null);
  private recoveryEmail = signal<string | null>(null);
  private recoveryExpiry = signal<number | null>(null);

  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    this.loadSession();
    this.loadSecurityState();
  }

  private loadSession() {
    const savedUser = localStorage.getItem('nitex_user');
    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('nitex_user');
      }
    }
  }

  private loadSecurityState() {
    const attempts = localStorage.getItem('nitex_failed_attempts');
    const lockout = localStorage.getItem('nitex_lockout_until');
    
    if (attempts) this.failedAttempts.set(parseInt(attempts));
    if (lockout) {
      const until = parseInt(lockout);
      if (until > Date.now()) {
        this.lockoutTime.set(until);
      } else {
        this.resetSecurityState();
      }
    }
  }

  private resetSecurityState() {
    this.failedAttempts.set(0);
    this.lockoutTime.set(null);
    localStorage.removeItem('nitex_failed_attempts');
    localStorage.removeItem('nitex_lockout_until');
  }

  getLockoutRemaining(): number {
    if (!this.lockoutTime()) return 0;
    const remaining = Math.max(0, this.lockoutTime()! - Date.now());
    if (remaining === 0) this.resetSecurityState();
    return Math.ceil(remaining / 1000);
  }

  login(email: string, password: string): { success: boolean, message?: string, showRecovery?: boolean } {
    const remainingSeconds = this.getLockoutRemaining();
    if (remainingSeconds > 0) {
      return { 
        success: false, 
        message: `Demasiados intentos, intenta más tarde o recupera tu contraseña`,
        showRecovery: true 
      };
    }

    // Demo bypass for admin (Hidden access)
    const isAdminBypass = (email === 'admin@nitex.com' || email === 'angelgabrieluribe156@gmail.com') && password === 'Nitex2026';
    
    if (isAdminBypass) {
      const admin: User = {
        id: 'admin_1',
        email: email,
        name: email === 'admin@nitex.com' ? 'Administrador Nitex' : 'Angel Gabriel (Admin)',
        role: 'admin',
        enrolledCourses: [],
        completedLessons: [],
        examResults: {},
        certificates: [],
        createdAt: Date.now()
      };
      this.resetSecurityState();
      this.setSession(admin);
      return { success: true };
    }

    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const user = users.find(u => u.email === email);
    
    // In a real app we'd verify hash.
    if (user && user.password === password) {
      if (user.blocked) {
        return { success: false, message: 'Tu cuenta ha sido bloqueada por un administrador.' };
      }
      this.resetSecurityState();
      this.setSession(user);
      return { success: true };
    }

    // Fail logic
    const newAttempts = this.failedAttempts() + 1;
    this.failedAttempts.set(newAttempts);
    localStorage.setItem('nitex_failed_attempts', newAttempts.toString());

    if (newAttempts >= this.MAX_ATTEMPTS) {
      const until = Date.now() + this.LOCKOUT_DURATION;
      this.lockoutTime.set(until);
      localStorage.setItem('nitex_lockout_until', until.toString());
      return { 
        success: false, 
        message: 'Demasiados intentos, intenta más tarde o recupera tu contraseña',
        showRecovery: true
      };
    }

    return { success: false, message: `Credenciales inválidas. Intentos restantes: ${this.MAX_ATTEMPTS - newAttempts}` };
  }

  // Recovery Methods
  private recoveryAttempts = signal(0);
  private readonly MAX_RECOVERY_ATTEMPTS = 5;

  sendRecoveryCode(email: string): { success: boolean, message: string } {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'El correo electrónico no existe en nuestra base de datos.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.recoveryCode.set(code);
    this.recoveryEmail.set(email);
    this.recoveryExpiry.set(Date.now() + 10 * 60 * 1000); // 10 minutes
    this.recoveryAttempts.set(0);

    // Simulated professional email sending
    console.log(`
      -----------------------------------------
      DE: NITEX <no-reply@nitex.com>
      PARA: ${email}
      ASUNTO: Tu código de verificación NITEX
      
      Hola ${user.name},
      Tu código de verificación es: ${code}
      
      Este código expirará en 10 minutos. Por seguridad, 
      no compartas este código con nadie.
      -----------------------------------------
    `);
    
    this.logAuditEvent(email, 'RECOVERY_CODE_SENT', `Código generado: ${code}`);
    return { success: true, message: 'Se ha enviado un código de seguridad a tu correo.' };
  }

  verifyRecoveryCode(code: string): { success: boolean, message?: string } {
    if (Date.now() > (this.recoveryExpiry() || 0)) {
      return { success: false, message: 'El código ha expirado. Solicita uno nuevo.' };
    }

    if (this.recoveryAttempts() >= this.MAX_RECOVERY_ATTEMPTS) {
      return { success: false, message: 'Demasiados intentos fallidos. Reinicia el proceso.' };
    }

    if (this.recoveryCode() === code) {
      this.recoveryAttempts.set(0);
      return { success: true };
    } else {
      this.recoveryAttempts.update(n => n + 1);
      return { success: false, message: `Código incorrecto. Intentos restantes: ${this.MAX_RECOVERY_ATTEMPTS - this.recoveryAttempts()}` };
    }
  }

  resetPassword(newPassword: string): boolean {
    const email = this.recoveryEmail();
    if (!email) return false;
    
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const idx = users.findIndex(u => u.email === email);
    
    if (idx !== -1) {
      users[idx].password = newPassword;
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
      
      this.logAuditEvent(email, 'PASSWORD_RESET_SUCCESS', 'Contraseña restablecida exitosamente');
      
      // Cleanup
      this.resetSecurityState();
      this.recoveryCode.set(null);
      this.recoveryEmail.set(null);
      this.recoveryExpiry.set(null);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    if (users.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      role: 'student',
      enrolledCourses: [],
      completedLessons: [],
      examResults: {},
      certificates: [],
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem('nitex_users_db', JSON.stringify(users));
    this.setSession(newUser);
    return true;
  }

  updateUser(updatedUser: User) {
    this._currentUser.set(updatedUser);
    localStorage.setItem('nitex_user', JSON.stringify(updatedUser));
    
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
    }
  }

  logout() {
    const user = this.currentUser();
    if (user) {
      this.logAuditEvent(user.email, 'LOGOUT', 'Sesión cerrada correctamente');
    }
    this._currentUser.set(null);
    localStorage.removeItem('nitex_user');
    this.router.navigate(['/auth/login']);
  }

  private logAuditEvent(email: string, action: string, details: string) {
    const logs = JSON.parse(localStorage.getItem('nitex_audit_logs') || '[]');
    logs.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      email,
      action,
      details
    });
    // Keep last 100 logs
    if (logs.length > 100) logs.shift();
    localStorage.setItem('nitex_audit_logs', JSON.stringify(logs));
  }

  private setSession(user: User) {
    this.logAuditEvent(user.email, 'LOGIN', 'Inicio de sesión exitoso');
    this._currentUser.set(user);
    localStorage.setItem('nitex_user', JSON.stringify(user));
  }
}
