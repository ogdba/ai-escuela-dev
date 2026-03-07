// =============================================================================
// Lesson data model — granular sub-lessons within each module
// =============================================================================

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface LessonSection {
  title: string;
  content: string[];
  code?: CodeExample;
  tip?: string;
}

export interface LessonExercise {
  instruction: string;
  hints: string[];
  solution?: CodeExample;
}

export interface Lesson {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  duration: string;
  objectives: string[];
  sections: LessonSection[];
  exercise: LessonExercise;
}

export interface ModuleLessons {
  moduleId: string;
  lessons: Lesson[];
}
