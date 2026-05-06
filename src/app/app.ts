import { ChangeDetectionStrategy, Component, inject, signal, computed, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-bg-main flex flex-col font-sans selection:bg-primary-100 selection:text-primary-700">
      
      <!-- 🌿 SaaS Premium Navbar (Sticky with Blur) -->
      <nav 
        [class.nav-scrolled]="isScrolled()"
        class="fixed top-0 left-0 w-full z-50 h-20 flex items-center px-6 lg:px-20 transition-all duration-500 bg-slate-900/95 backdrop-blur-xl border-b border-white/10"
      >
        <div class="max-w-full mx-auto w-full flex items-center justify-between">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group cursor-pointer text-white">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-500">
              <mat-icon class="scale-90 lg:scale-110">rocket_launch</mat-icon>
            </div>
            <span class="text-xl lg:text-2xl font-black tracking-tighter uppercase italic">Nitex</span>
          </a>

          <!-- Nav Links (Center Pill - Desktop) -->
          <div class="hidden lg:flex items-center gap-4">
            <div class="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-sm">
              <a routerLink="/" routerLinkActive="nav-link-active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
                Inicio
              </a>
              <a routerLink="/courses" routerLinkActive="nav-link-active" class="nav-link">
                Cursos
              </a>
              <a routerLink="/about" routerLinkActive="nav-link-active" class="nav-link">
                Nosotros
              </a>
            </div>
          </div>

          <!-- Right Side: Auth & Mobile Toggle -->
          <div class="flex items-center gap-4 lg:gap-6">
            <!-- 🔍 Desktop Search -->
            <div class="relative group hidden xl:block">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 scale-75 group-focus-within:text-cyan-400 transition-colors">search</mat-icon>
              <input 
                type="text" 
                placeholder="Buscar cursos..." 
                class="w-48 bg-white/5 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-[11px] font-bold text-white/80 focus:bg-white/10 focus:border-cyan-500/50 transition-all outline-none placeholder:text-white/20"
              >
            </div>

            @if (user()) {
              <div class="relative">
                <button 
                  (click)="isMenuOpen.set(!isMenuOpen())"
                  class="flex items-center gap-3 lg:gap-4 p-1.5 lg:p-2 pr-4 lg:pr-5 bg-white/5 backdrop-blur-sm rounded-full border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group"
                >
                  <div class="relative shrink-0">
                    <div class="w-9 h-9 lg:w-11 lg:h-11 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-blue-500 overflow-hidden shadow-sm flex items-center justify-center">
                      @if (user()?.avatar) {
                        <img [src]="user()?.avatar" class="w-full h-full object-cover rounded-full bg-slate-900">
                      } @else {
                        <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 font-black text-xs lg:text-sm">
                          {{ user()?.name?.charAt(0) | uppercase }}
                        </div>
                      }
                    </div>
                  </div>
                  <div class="text-left hidden md:block mr-1 lg:mr-2">
                    <p class="text-[9px] font-black uppercase tracking-widest text-cyan-500/60 leading-none mb-1">Activo</p>
                    <p class="text-xs lg:text-sm font-bold text-white/90 leading-none truncate max-w-[100px] lg:max-w-[120px]">{{ user()?.name }}</p>
                  </div>
                  <mat-icon class="text-white/20 group-hover:text-cyan-400 transition-colors scale-90 lg:scale-100">expand_more</mat-icon>
                </button>

                @if (isMenuOpen()) {
                  <div class="absolute right-0 mt-4 w-72 bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden z-[60] animate-fade-up">
                    <div class="p-8 bg-slate-50/50 border-b border-slate-100 text-center">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mi Cuenta</p>
                      <p class="text-sm font-black text-text-title truncate">{{ user()?.email }}</p>
                    </div>
                    <div class="p-4 space-y-1">
                      <a (click)="closeMenu()" routerLink="/profile" class="dropdown-item">
                        <mat-icon>person_outline</mat-icon> Mi Perfil
                      </a>
                      @if (authService.isAdmin()) {
                        <a (click)="closeMenu()" routerLink="/admin" class="dropdown-item">
                          <mat-icon>admin_panel_settings</mat-icon> Panel Admin
                        </a>
                      }
                      <div class="h-px bg-slate-50 my-2 mx-4"></div>
                      <button (click)="logout()" class="dropdown-item w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                        <mat-icon>logout</mat-icon> Cerrar sesión
                      </button>
                    </div>
                  </div>
                  <div (click)="closeMenu()" class="fixed inset-0 z-50"></div>
                }
              </div>
            } @else {
              <div class="hidden sm:flex items-center gap-3">
                <a routerLink="/auth/login" class="text-[11px] font-black text-white/70 hover:text-white uppercase tracking-widest px-4 py-2">
                  Entrar
                </a>
                <a routerLink="/auth/register" class="btn-primary py-2.5 px-6 text-[10px] font-black shadow-lg shadow-primary-500/20">
                  Registrarse
                </a>
              </div>
            }

            <!-- 📱 Mobile Menu Toggle -->
            <button 
              (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
              class="lg:hidden w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10"
            >
              <mat-icon>{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>

        <!-- 📱 Mobile Menu Dropdown -->
        @if (isMobileMenuOpen()) {
          <div class="absolute top-20 left-0 w-full bg-slate-900 border-b border-white/10 lg:hidden animate-fade-down z-40">
            <div class="p-6 space-y-3">
              <a (click)="isMobileMenuOpen.set(false)" routerLink="/" class="flex items-center gap-4 p-4 rounded-2xl text-white/70 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                <mat-icon>home</mat-icon> Inicio
              </a>
              <a (click)="isMobileMenuOpen.set(false)" routerLink="/courses" class="flex items-center gap-4 p-4 rounded-2xl text-white/70 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                <mat-icon>school</mat-icon> Cursos
              </a>
              <a (click)="isMobileMenuOpen.set(false)" routerLink="/about" class="flex items-center gap-4 p-4 rounded-2xl text-white/70 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                <mat-icon>info</mat-icon> Nosotros
              </a>
              @if (!user()) {
                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <a routerLink="/auth/login" (click)="isMobileMenuOpen.set(false)" class="p-4 rounded-2xl bg-white/5 text-white text-center font-black uppercase text-[10px] tracking-widest">Login</a>
                  <a routerLink="/auth/register" (click)="isMobileMenuOpen.set(false)" class="p-4 rounded-2xl bg-primary-500 text-white text-center font-black uppercase text-[10px] tracking-widest">Únete</a>
                </div>
              }
            </div>
          </div>
        }
      </nav>

      <!-- 🚀 Main Viewport -->
      <main class="flex-grow pt-20 overflow-x-hidden">
        <router-outlet></router-outlet>
      </main>

      <!-- 🦶 Footer Premium -->
      @if (showFooter()) {
        <footer class="bg-slate-900 text-white pt-24 pb-12 px-6 lg:px-20 mt-auto relative overflow-hidden">
          <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div class="max-w-full mx-auto relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
              <div class="space-y-8">
                 <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <mat-icon>rocket_launch</mat-icon>
                  </div>
                  <span class="text-2xl font-black tracking-tighter uppercase italic leading-none">Nitex</span>
                </div>
                <p class="text-sm text-slate-400 leading-relaxed font-medium italic">
                  Transformando la educación digital con experiencias premium y contenido de élite. Formación técnica superior sin fronteras.
                </p>
                <div class="flex gap-4">
                  <a href="#" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"><mat-icon class="scale-75">facebook</mat-icon></a>
                  <a href="#" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"><mat-icon class="scale-75">camera_alt</mat-icon></a>
                  <a href="#" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"><mat-icon class="scale-75">language</mat-icon></a>
                </div>
              </div>

              <div>
                <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-8">Contacto</h4>
                <ul class="space-y-6">
                  <li class="flex items-start gap-4">
                    <mat-icon class="text-primary-500 scale-75 mt-1">location_on</mat-icon>
                    <div>
                      <p class="text-sm font-bold">Los Mina, Calle B</p>
                      <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Sede Central</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-4">
                    <mat-icon class="text-primary-500 scale-75 mt-1">phone</mat-icon>
                    <div>
                      <p class="text-sm font-bold">829-644-9035</p>
                      <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">WhatsApp Business</p>
                    </div>
                  </li>
                  <li class="flex items-start gap-4">
                    <mat-icon class="text-primary-500 scale-75 mt-1">mail</mat-icon>
                    <div>
                      <p class="text-sm font-bold">angelgabrieluribe156@gmail.com</p>
                      <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Soporte Académico</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-8">Ubicación</h4>
                <div class="w-full aspect-video rounded-3xl overflow-hidden grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15132.3278853683!2d-69.855018!3d18.502396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89b6c0397b91%3A0xc3f0b09332204c3!2sLos%20Mina%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1714986745123!5m2!1ses!2sdo" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              <div class="bg-white/5 p-10 rounded-[48px] border border-white/10 relative overflow-hidden">
                 <h4 class="text-xl font-black text-primary-500 mb-4 tracking-tight italic uppercase">Master News</h4>
                 <p class="text-xs text-slate-400 mb-8 italic">Recibe actualizaciones de cursos elite cada semana.</p>
                 <div class="flex gap-2">
                   <input type="text" placeholder="Email" class="w-full bg-slate-800 border-0 rounded-2xl px-5 py-4 text-xs outline-none focus:ring-2 ring-primary-500">
                   <button class="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><mat-icon class="scale-75">send</mat-icon></button>
                 </div>
              </div>
            </div>
            <div class="pt-12 border-t border-white/5 flex justify-between items-center">
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">© 2026 NITEX ACADEMY. TODOS LOS DERECHOS RESERVADOS.</p>
              <div class="flex gap-8">
                <a href="#" class="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacidad</a>
                <a href="#" class="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Términos</a>
              </div>
            </div>
          </div>
        </footer>
      }

    </div>
  `,
  styles: [`
    :host { display: block; }
    .nav-scrolled {
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      background-color: rgba(15, 23, 42, 0.98); /* Mantener oscuro */
      border-color: rgba(255, 255, 255, 0.05);
    }
    .nav-link { 
      font-size: 13px;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      background: transparent !important;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 0;
      height: 2px;
      background: #06b6d4; /* Cian suave */
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 2px;
    }
    .nav-link:hover { 
      color: #06b6d4 !important; 
      text-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    }
    .nav-link:hover::after {
      width: 20px;
    }
    .nav-link-active { 
      color: #22d3ee !important; 
    }
    .nav-link-active::after {
      width: 24px;
      background: #22d3ee;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      transition: all 0.3s ease;
      cursor: pointer;
      border-radius: 1rem;
      margin: 0 0.5rem;
    }
    .dropdown-item:hover {
      background-color: rgba(6, 182, 212, 0.05);
      color: #06b6d4;
    }
    .dropdown-item mat-icon { 
      transform: scale(0.75);
    }
  `]
})
export class App {
  public authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());
  isMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);
  currentUrl = signal(this.router.url);
  
  showFooter = computed(() => {
    const url = this.currentUrl();
    return !url.includes('/auth/') && !url.includes('/admin');
  });

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
      window.scrollTo(0, 0);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  closeMenu() { this.isMenuOpen.set(false); }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }
}