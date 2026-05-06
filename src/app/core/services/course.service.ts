import { Injectable, signal, computed } from '@angular/core';
import { Course, LevelStructure, Lesson, Exam } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private courses = signal<Course[]>([
    {
      id: '1',
      title: "Secretaría Recepcionista y Servicio al Cliente",
      category: "Administración",
      shortDescription: "Atención al cliente, manejo de llamadas y organización de oficina profesional.",
      fullDescription: "Domina las habilidades administrativas críticas. Aprenderás gestión de agenda, comunicación asertiva, protocolos de oficina y herramientas digitales de vanguardia.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800",
      instructor: "Profesional administrativo",
      duration: "4 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.8,
      featured: true
    },
    {
      id: '2',
      title: "Estilista en Belleza",
      category: "Belleza",
      shortDescription: "Corte, peinado y cuidado integral del cabello.",
      fullDescription: "Formación completa en técnicas de estilismo profesional. Desde el corte básico hasta peinados de gala y tratamientos capilares avanzados.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800",
      instructor: "Master Stylist",
      duration: "5 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.7
    },
    {
      id: '3',
      title: "Cajero Bancario Computarizado",
      category: "Finanzas",
      shortDescription: "Manejo de caja, sistemas bancarios y atención al cliente financiero.",
      fullDescription: "Capacitación técnica para el sector bancario. Incluye manejo de efectivo, detección de billetes falsos y software bancario especializado.",
      image: "https://images.unsplash.com/photo-1556742049-317734898394?q=80&w=800",
      instructor: "Experto Financiero",
      duration: "4 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.9,
      featured: true
    },
    {
      id: '4',
      title: "Uñas Acrílicas",
      category: "Belleza",
      shortDescription: "Técnicas de aplicación y diseño artístico de uñas.",
      fullDescription: "Aprende el arte del esculpido y diseño. Desde manicura rusa hasta técnicas avanzadas de acrílico y Nail Art.",
      image: "https://images.unsplash.com/photo-1604654894610-df4906687103?q=80&w=800",
      instructor: "Nail Artist Pro",
      duration: "3 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/p1oYI8ZUnB0",
      lessonsCount: 4,
      rating: 4.6
    },
    {
      id: '5',
      title: "Auxiliar en Farmacia",
      category: "Salud",
      shortDescription: "Medicamentos, atención al cliente y control de inventario farmacéutico.",
      fullDescription: "Conocimientos esenciales en farmacología básica, dispensación de medicamentos y gestión administrativa de farmacias.",
      image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800",
      instructor: "Farmacéutico Titulado",
      duration: "5 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.7
    },
    {
      id: '6',
      title: "Barbería Profesional",
      category: "Belleza",
      shortDescription: "Cortes modernos, degradados extremos y perfilado de barba.",
      fullDescription: "Domina el arte de la barbería clásica y moderna. Fades, visagismo y técnicas de afeitado tradicional.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800",
      instructor: "Master Barber",
      duration: "5 semanas",
      level: "Intermedio",
      video: "https://www.youtube.com/embed/H_W_2mPqQYk",
      lessonsCount: 4,
      rating: 4.8,
      featured: true
    },
    {
      id: '7',
      title: "Auxiliar de Enfermería",
      category: "Salud",
      shortDescription: "Cuidados básicos, signos vitales y asistencia médica profesional.",
      fullDescription: "Formación en el cuidado integral del paciente. Primeros auxilios, administración de cuidados y soporte médico básico.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800",
      instructor: "Enfermera Especialista",
      duration: "6 semanas",
      level: "Intermedio",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.9
    },
    {
      id: '8',
      title: "Informática Básica",
      category: "Tecnología",
      shortDescription: "Uso de computadora, Microsoft Word, Excel e Internet.",
      fullDescription: "Alfabetización digital completa. Aprende a dominar las herramientas de oficina más demandadas en el mundo laboral.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
      instructor: "Ingeniero de Sistemas",
      duration: "4 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.7
    },
    {
      id: '9',
      title: "Estilismo en Cejas y Pestañas",
      category: "Belleza",
      shortDescription: "Diseño de cejas, lifting y extensiones de pestañas pelo a pelo.",
      fullDescription: "Técnicas de embellecimiento de la mirada. Visagismo de cejas, laminado y aplicación profesional de pestañas.",
      image: "https://images.unsplash.com/photo-1522338140262-f46f591261c2?q=80&w=800",
      instructor: "Lash Artist Master",
      duration: "3 semanas",
      level: "Intermedio",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.8
    },
    {
      id: '10',
      title: "Facial y Maquillaje",
      category: "Belleza",
      shortDescription: "Cuidado facial profundo y técnicas de maquillaje profesional.",
      fullDescription: "Estética facial y arte del maquillaje. Preparación de piel, colorimetría y maquillajes para eventos sociales.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
      instructor: "Makeup Artist Elite",
      duration: "4 semanas",
      level: "Intermedio",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      lessonsCount: 4,
      rating: 4.7
    },
    {
      id: '11',
      title: "Inglés Básico",
      category: "Idiomas",
      shortDescription: "Vocabulario, pronunciación y frases cotidianas esenciales.",
      fullDescription: "Inicia tu camino en el idioma global. Enfoque conversacional desde el primer día para situaciones del mundo real.",
      image: "https://images.unsplash.com/photo-1543167601-39955027130c?q=80&w=800",
      instructor: "Language Expert",
      duration: "6 semanas",
      level: "Básico",
      video: "https://www.youtube.com/embed/v9C0pA-W0_I",
      lessonsCount: 4,
      rating: 4.9
    },
    {
      id: '12',
      title: "Reparación y Mantenimiento de Celulares",
      category: "Tecnología",
      shortDescription: "Diagnóstico, reparación de hardware y herramientas técnicas.",
      fullDescription: "Conviértete en técnico profesional. Micro-soldadura, cambio de componentes y optimización de dispositivos móviles.",
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800",
      instructor: "Técnico Especialista",
      duration: "6 semanas",
      level: "Intermedio",
      video: "https://www.youtube.com/embed/zH09zN70KDM",
      lessonsCount: 4,
      rating: 4.8,
      featured: true
    }
  ]);

  getAllCourses() {
    return this.courses;
  }

  getCourseById(id: string): Course | undefined {
    return this.courses().find(c => c.id === id);
  }

  getCourseProgress(courseId: string): number {
    const user = JSON.parse(localStorage.getItem('nitex_user') || '{}');
    if (!user || !user.enrolledCourses?.includes(courseId)) return 0;
    
    const levels = this.getCourseLevels(courseId);
    const totalLessons = levels.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
    const completedCount = levels.reduce((acc, lvl) => {
      return acc + lvl.lessons.filter(l => user.completedLessons?.includes(l.id)).length;
    }, 0);

    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  }

  getCourseLevels(courseId: string): LevelStructure[] {
    const course = this.getCourseById(courseId);
    const title = course?.title || 'Curso';

    return [
      {
        id: 0,
        name: '🎬 Introducción',
        lessons: [
          {
            id: `${courseId}-intro`,
            title: `Bienvenida a ${title}`,
            description: `Video de introducción y objetivos del programa.`,
            content: `<p>¡Bienvenido a Nitex! En este video de introducción, conocerás la hoja de ruta para dominar <strong>${title}</strong>. Analizaremos los objetivos clave y la metodología técnica que aplicaremos en cada unidad.</p>`,
            videoUrl: course?.video || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '05:00'
          }
        ]
      },
      {
        id: 1,
        name: '📘 Nivel 1: Fundamentos Críticos',
        lessons: [
          {
            id: `${courseId}-l1`,
            title: 'Teoría y Conceptos Base',
            description: 'Estudio de los pilares fundamentales.',
            content: `<h3>1.1 Fundamentos de ${title}</h3><p>En este nivel inicial, establecemos los cimientos teóricos. La maestría técnica nace de un conocimiento sólido de los principios. Exploraremos la terminología, herramientas básicas y estándares internacionales del área.</p>`,
            duration: '15:00'
          }
        ]
      },
      {
        id: 2,
        name: '📘 Nivel 2: Desarrollo Técnico',
        lessons: [
          {
            id: `${courseId}-l2`,
            title: 'Protocolos de Ejecución',
            description: 'Metodología aplicada paso a paso.',
            content: `<h3>2.1 Metodología Aplicada</h3><p>Habiendo superado los fundamentos, en este nivel nos enfocamos en la ejecución técnica. Analizaremos protocolos reales, optimización de tiempos y resolución de problemas comunes en el entorno laboral.</p>`,
            duration: '25:00'
          }
        ]
      },
      {
        id: 3,
        name: '📘 Nivel 3: Perfeccionamiento Elite',
        lessons: [
          {
            id: `${courseId}-l3`,
            title: 'Maestría y Calidad Superior',
            description: 'Nivel experto y estándares de la industria.',
            content: `<h3>3.1 Excelencia Profesional</h3><p>El nivel final se centra en la perfección. Buscamos que el trabajo cumpla con los estándares más exigentes de la industria global. Estrategias avanzadas, control de calidad y preparación para el mercado laboral.</p>`,
            duration: '30:00'
          }
        ]
      }
    ];
  }

  getFinalExam(courseId: string): Exam {
    const course = this.getCourseById(courseId);
    return {
      id: `${courseId}_final_exam`,
      questions: [
        {
          id: 'q1',
          text: `¿Cuál es el objetivo principal del Nivel 1 de este curso?`,
          options: ['Improvisar', 'Establecer fundamentos teóricos', 'Solo ver videos', 'No tiene objetivo'],
          correctIndex: 1
        },
        {
          id: 'q2',
          text: `¿Qué se analiza en el Nivel 2?`,
          options: ['Protocolos de ejecución', 'Redes sociales', 'Música', 'Juegos'],
          correctIndex: 0
        },
        {
          id: 'q3',
          text: `¿A qué se enfoca el Nivel 3 de Nitex?`,
          options: ['Básico', 'Excelencia y estándares de la industria', 'Dibujo', 'Inglés'],
          correctIndex: 1
        },
        {
          id: 'q4',
          text: `¿Qué porcentaje es necesario para aprobar el examen?`,
          options: ['50%', '60%', '70%', '100%'],
          correctIndex: 2
        },
        {
          id: 'q5',
          text: `¿El certificado se genera automáticamente al aprobar?`,
          options: ['No', 'A veces', 'Sí, con 70% o más', 'Nunca'],
          correctIndex: 2
        }
      ]
    };
  }

  saveExamResult(courseId: string, score: number) {
    const user = JSON.parse(localStorage.getItem('nitex_user') || '{}');
    if (!user || !user.id) return;
    if (!user.examResults) user.examResults = {};
    user.examResults[courseId] = score;
    localStorage.setItem('nitex_user', JSON.stringify(user));
    this.syncUserToDb(user);
  }

  generateCertificate(courseId: string) {
    const user = JSON.parse(localStorage.getItem('nitex_user') || '{}');
    if (!user || !user.id) return;
    const course = this.getCourseById(courseId);
    if (!course) return;
    if (!user.certificates) user.certificates = [];
    if (!user.certificates.find((c: any) => c.courseId === courseId)) {
      user.certificates.push({
        id: 'NTX-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        courseId,
        courseName: course.title,
        userName: user.name,
        date: Date.now(),
        qrCode: `NTX-${courseId}-${user.id.substring(0,5)}`
      });
      localStorage.setItem('nitex_user', JSON.stringify(user));
      this.syncUserToDb(user);
    }
  }

  enrollInCourse(courseId: string): boolean {
    const user = JSON.parse(localStorage.getItem('nitex_user') || '{}');
    if (!user || !user.id) return false;
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      localStorage.setItem('nitex_user', JSON.stringify(user));
      this.syncUserToDb(user);
      return true;
    }
    return false;
  }

  addCourse(course: Course) {
    this.courses.update(list => [...list, course]);
  }

  updateCourse(updatedCourse: Course) {
    this.courses.update(list => list.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  }

  deleteCourse(id: string) {
    this.courses.update(list => list.filter(c => c.id !== id));
  }

  private syncUserToDb(user: any) {
    const users = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
    }
  }
}
