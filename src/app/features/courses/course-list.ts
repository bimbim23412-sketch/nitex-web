import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule, SafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-main min-h-screen pb-32">
      
      <!-- 🌿 SaaS Premium Header (Matched to Home) -->
      <header class="pt-24 lg:pt-32 pb-16 lg:pb-20 px-6 lg:px-12 relative overflow-hidden bg-white">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/50 rounded-full blur-[120px]"></div>
        
        <div class="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start gap-4 mb-8 animate-fade">
              <div class="w-12 h-1 bg-primary-500 rounded-full"></div>
              <span class="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.5em] text-primary-600">Formación Técnica Superior</span>
            </div>
            <h1 class="text-4xl lg:text-8xl font-black text-text-title tracking-tighter uppercase italic leading-[0.9] mb-8 animate-fade-up">
              Catálogo <span class="text-primary-500 underline decoration-primary-100 italic">Elite</span>.
            </h1>
            <p class="text-lg lg:text-xl text-text-muted font-medium max-w-2xl leading-relaxed mb-12 animate-fade-up mx-auto lg:mx-0">
               Explora nuestra selección de especialidades diseñadas para el mercado laboral actual.
            </p>
            
            <div class="relative max-w-2xl animate-fade-up mx-auto lg:mx-0">
              <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">search</mat-icon>
              <input 
                [formControl]="searchControl"
                type="text" 
                placeholder="¿Qué habilidad deseas dominar hoy?" 
                class="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-6 lg:py-7 pl-16 pr-8 text-xs lg:text-sm font-bold shadow-2xl shadow-slate-200/20 focus:bg-white focus:border-primary-500 transition-all outline-none"
              >
            </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        <div class="space-y-16">
          
          <!-- 📂 Category Selector -->
          <div class="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
            @for (cat of categories; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                class="shrink-0 px-6 lg:px-8 py-4 lg:py-5 rounded-[20px] lg:rounded-[24px] text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3"
                [class]="selectedCategory() === cat ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-primary-200'"
              >
                <mat-icon class="scale-75">{{ getCategoryIcon(cat) }}</mat-icon>
                {{ cat }}
              </button>
            }
          </div>

          <!-- 🖼️ Course Grid -->
          <main class="animate-fade animate-fade-up">
            @if (filteredCourses().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                @for (course of filteredCourses(); track course.id) {
                  <div class="group bg-white rounded-[40px] lg:rounded-[64px] overflow-hidden border border-slate-100 hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col p-6 lg:p-10 cursor-pointer" [routerLink]="['/courses', course.id]">
                    
                    <!-- 🖼️ Imagen del Curso y Video Preview -->
                    <div class="aspect-[4/3] relative overflow-hidden rounded-[32px] lg:rounded-[40px] mb-8 group-hover:shadow-xl transition-all duration-700 bg-slate-900">
                      @if (activePreviewId() === course.id) {
                        <iframe 
                          [src]="course.video + '?autoplay=1&mute=1' | safe:'resource'" 
                          class="w-full h-full pointer-events-none" 
                          frameborder="0"
                        ></iframe>
                      } @else {
                        <img [src]="course.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <button 
                          (click)="$event.stopPropagation(); togglePreview(course.id)"
                          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                            <mat-icon class="scale-[1.5]">play_arrow</mat-icon>
                          </div>
                        </button>
                      }
                      <div class="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-xl text-[8px] font-black text-primary-600 uppercase tracking-widest border border-white">
                        {{ course.category }}
                      </div>
                    </div>

                    <!-- 📝 Nombre y Descripción -->
                    <div class="space-y-4 mb-8">
                      <h3 class="text-2xl lg:text-3xl font-black text-text-title leading-tight italic uppercase tracking-tighter group-hover:text-primary-500 transition-colors">
                        {{ course.title }}
                      </h3>
                      <p class="text-[13px] lg:text-sm text-text-muted font-medium italic line-clamp-2 leading-relaxed">
                        {{ course.shortDescription }}
                      </p>
                    </div>

                    <div class="flex items-center gap-6 mb-8 opacity-60">
                      <div class="flex items-center gap-2 text-primary-600">
                        <mat-icon class="scale-50">school</mat-icon>
                        <span class="text-[9px] font-black uppercase tracking-widest">{{ course.level }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-slate-400">
                        <mat-icon class="scale-50">schedule</mat-icon>
                        <span class="text-[9px] font-black uppercase tracking-widest">{{ course.duration }}</span>
                      </div>
                    </div>

                    <!-- 📊 Barra de Progreso (Solo si está inscrito) -->
                    @if (isEnrolled(course.id)) {
                      <div class="mb-8 space-y-3 animate-fade">
                        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                           <span class="text-slate-400">Progreso</span>
                           <span class="text-primary-500">{{ getProgress(course.id) }}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                           <div [style.width.%]="getProgress(course.id)" class="h-full bg-primary-500 transition-all duration-1000"></div>
                        </div>
                      </div>
                    }
                    
                    <div class="pt-6 border-t border-slate-50 mt-auto">
                      <button 
                        (click)="$event.stopPropagation(); goToCourse(course.id)" 
                        class="w-full py-4 lg:py-5 rounded-[20px] lg:rounded-[24px] text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group shadow-lg"
                        [class]="isEnrolled(course.id) ? 'bg-primary-100 text-primary-600 shadow-primary-500/10' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/20'"
                      >
                        <div class="icon-text flex items-center justify-center gap-2">
                          <span>{{ isEnrolled(course.id) ? 'Entrar al curso' : 'Acceso Inmediato' }}</span>
                          <mat-icon class="scale-75 group-hover:translate-x-1 transition-transform">
                            {{ isEnrolled(course.id) ? 'play_circle' : 'bolt' }}
                          </mat-icon>
                        </div>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="flex flex-col items-center justify-center py-20 lg:py-40 bg-white rounded-[40px] lg:rounded-[80px] border border-slate-50 shadow-sm text-center px-10">
                <div class="w-20 h-20 lg:w-24 lg:h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10">
                  <mat-icon class="scale-150">search_off</mat-icon>
                </div>
                <h3 class="text-2xl lg:text-3xl font-black text-text-title tracking-tighter mb-4 italic uppercase">Sin Resultados</h3>
                <p class="text-text-muted font-medium mb-12 max-w-md">No hemos encontrado cursos que coincidan con tu criterio actual.</p>
                <button (click)="resetFilters()" class="btn-primary">Ver Todos los Cursos</button>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
})
export class CourseList {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  searchControl = new FormControl('');
  selectedCategory = signal('Todos');
  activePreviewId = signal<string | null>(null);
  categories = ['Todos', 'Administración', 'Belleza', 'Finanzas', 'Salud', 'Tecnología', 'Idiomas'];

  private courses = this.courseService.getAllCourses();
  private searchTerm = signal('');
  user = computed(() => this.auth.currentUser());

  togglePreview(id: string) {
    if (this.activePreviewId() === id) {
      this.activePreviewId.set(null);
    } else {
      this.activePreviewId.set(id);
    }
  }

  goToCourse(courseId: string) {
    if (this.isEnrolled(courseId)) {
      this.router.navigate(['/learning', courseId]);
    } else {
      this.router.navigate(['/courses', courseId]);
    }
  }

  isEnrolled(courseId: string): boolean {
    return this.user()?.enrolledCourses.includes(courseId) || false;
  }

  getProgress(courseId: string): number {
    return this.courseService.getCourseProgress(courseId);
  }

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith('')
    ).subscribe(val => this.searchTerm.set(val || ''));

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['q']) this.searchControl.setValue(params['q']);
    });
  }

  filteredCourses = computed(() => {
    return this.courses().filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesCat = this.selectedCategory() === 'Todos' || c.category === this.selectedCategory();
      return matchesSearch && matchesCat;
    });
  });

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Todos': 'grid_view',
      'Administración': 'business',
      'Belleza': 'face',
      'Finanzas': 'payments',
      'Salud': 'medical_services',
      'Tecnología': 'terminal',
      'Idiomas': 'translate'
    };
    return icons[category] || 'folder';
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.selectedCategory.set('Todos');
  }
}
