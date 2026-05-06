import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="relative w-full h-[500px] lg:h-[700px] overflow-hidden bg-white"
      (mouseenter)="stopAutoplay()"
      (mouseleave)="startAutoplay()"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      <!-- Slides Layer -->
      @for (course of featuredCourses(); track course.id; let i = $index) {
        <div 
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          [class.opacity-100.z-10]="currentSlide() === i"
          [class.opacity-0.z-0]="currentSlide() !== i"
          [class.pointer-events-none]="currentSlide() !== i"
          [style.visibility]="currentSlide() === i ? 'visible' : 'hidden'"
        >
          <div class="max-w-7xl mx-auto h-full px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
            
            <!-- Left Side Content -->
            <div class="space-y-4 lg:space-y-6 relative z-20 pt-10 lg:pt-0 text-center lg:text-left" [class.animate-slide-up]="currentSlide() === i" [class.opacity-0]="currentSlide() !== i">
               <div class="flex items-center justify-center lg:justify-start gap-3 text-primary-500 text-[8px] lg:text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                  <div class="w-10 h-1 bg-primary-500 rounded-full hidden lg:block"></div>
                  <span>Educación Técnica Superior</span>
               </div>
               
               <h1 class="text-3xl md:text-5xl lg:text-7xl font-black text-text-title tracking-tighter leading-[1.1] uppercase italic">
                  Capacítate hoy, <br> transforma <span class="text-primary-500">tu futuro</span>
               </h1>

               <p class="text-sm lg:text-xl text-text-muted font-medium italic leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {{ course.shortDescription }}
               </p>

               <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                  <a routerLink="/courses" class="btn-primary group w-full sm:w-auto py-4 lg:py-6 px-10 lg:px-16 rounded-[24px] lg:rounded-[32px] text-[10px] lg:text-xs">
                    <div class="icon-text flex items-center justify-center gap-2">
                       <span>Catálogo Elite</span>
                       <mat-icon class="scale-90 group-hover:translate-x-2 transition-transform">school</mat-icon>
                    </div>
                  </a>
                  @if (!user()) {
                    <a routerLink="/auth/register" class="btn-secondary group w-full sm:w-auto py-4 lg:py-6 px-10 lg:px-16 rounded-[24px] lg:rounded-[32px] text-[10px] lg:text-xs">
                      <div class="icon-text flex items-center justify-center gap-2">
                         <mat-icon class="text-primary-500 scale-90 group-hover:rotate-12 transition-transform">person_add</mat-icon>
                         <span>Crear cuenta</span>
                      </div>
                    </a>
                  }
               </div>
            </div>

            <!-- Right Side Image (Desktop Only for better focus on mobile) -->
            <div class="relative hidden lg:flex items-center justify-end animate-fade-in">
               <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[100px] opacity-60"></div>
               
               <div class="relative">
                  <div class="w-[350px] lg:w-[500px] relative z-10">
                     <img 
                       [src]="course.image" 
                       class="w-full h-auto rounded-[60px] lg:rounded-[80px] shadow-2xl relative z-10" 
                       [alt]="course.title"
                     >
                     
                     <!-- Floating Badge -->
                     <div class="absolute -top-10 -right-10 bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100 flex items-center gap-5 z-20 animate-bounce-slow">
                        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                           <mat-icon>verified</mat-icon>
                        </div>
                        <div>
                           <p class="text-[10px] font-black text-text-title uppercase tracking-widest">Certificado</p>
                           <p class="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Validez Industrial</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Indicators -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        @for (course of featuredCourses(); track course.id; let idx = $index) {
          <button 
            (click)="setSlide(idx)"
            class="group relative h-1.5 transition-all duration-500 overflow-hidden rounded-full"
            [class]="currentSlide() === idx ? 'w-12 bg-primary-500 shadow-lg shadow-primary-500/20' : 'w-4 bg-slate-200 hover:bg-slate-300'"
          >
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-up {
      animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-bounce-slow {
      animation: bounceSlow 4s infinite ease-in-out;
    }
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
  `]
})
export class HeroCarousel {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);
  
  featuredCourses = computed(() => {
    const all = this.courseService.getAllCourses()();
    return all.filter(c => c.featured).slice(0, 3);
  });
  
  user = computed(() => this.auth.currentUser());
  currentSlide = signal(0);
  private autoplayInterval: any;

  constructor() {
    this.startAutoplay();
  }

  setSlide(idx: number) {
    this.currentSlide.set(idx);
    this.stopAutoplay();
    this.startAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.currentSlide.update(prev => (prev + 1) % this.featuredCourses().length);
    }, 6000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
  }

  // Touch support for mobile
  private touchStartX = 0;
  onTouchStart(e: TouchEvent) { this.touchStartX = e.touches[0].clientX; }
  onTouchEnd(e: TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.setSlide((this.currentSlide() + 1) % this.featuredCourses().length);
      else this.setSlide((this.currentSlide() - 1 + this.featuredCourses().length) % this.featuredCourses().length);
    }
  }
}
