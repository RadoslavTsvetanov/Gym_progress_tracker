interface User{
    username: string,
    toekn:string
}

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
}

interface Workout {
  id: number;
  type: string;
  programId: number;
  exercises: Exercise[];
}

interface Program {
  program: {
    workouts: Workout[];
  };
}

interface ExercisesData {
  id: number;
  username: string;
  programId: number | null;
  program: Program;
  // ... other exercises data properties
}

export type{
    User,
    Exercise,
    Workout,
    Program,
    ExercisesData
}